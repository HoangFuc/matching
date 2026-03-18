import { useCallback, useEffect, useRef, useState } from 'react';
import type { VerificationStatus } from '../component/VerificationCodeSection';

const TIMER_DURATION = 120; // 2 minutes

interface UseVerificationCodeOptions {
  onSendCode: (phone: string) => Promise<void>;
  onVerifyCode: (phone: string, code: string) => Promise<boolean>;
  duration?: number;
}

export const useVerificationCode = ({
  onSendCode,
  onVerifyCode,
  duration = TIMER_DURATION,
}: UseVerificationCodeOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>('sent');
  const [code, setCode] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(duration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  //---------------------------------------
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  //---------------------------------------
  const startTimer = useCallback(() => {
    clearTimer();
    setRemainingSeconds(duration);

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearTimer();
          setStatus(current => (current === 'verified' ? current : 'expired'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, duration]);

  //---------------------------------------
  const sendCode = useCallback(
    async (phone: string) => {
      await onSendCode(phone);
      setCode('');
      setStatus('sent');
      setIsVisible(true);
      startTimer();
    },
    [onSendCode, startTimer],
  );

  //---------------------------------------
  const verifyCode = useCallback(
    async (phone: string) => {
      const isValid = await onVerifyCode(phone, code);
      if (isValid) {
        setStatus('verified');
        clearTimer();
      } else {
        setStatus('error');
      }
    },
    [code, onVerifyCode, clearTimer],
  );

  //---------------------------------------
  const resend = useCallback(
    async (phone: string) => {
      await onSendCode(phone);
      setCode('');
      setStatus('sent');
      startTimer();
    },
    [onSendCode, startTimer],
  );

  //---------------------------------------
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    isVisible,
    status,
    code,
    setCode,
    remainingSeconds,
    sendCode,
    verifyCode,
    resend,
  };
};
