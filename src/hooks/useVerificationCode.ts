import { useCallback, useEffect, useRef, useState } from 'react';
import type { VerificationStatus } from '../component/VerificationCodeSection';

const TIMER_DURATION = 120; // 2 minutes

const OTP_ERROR_MESSAGES: Record<string, string> = {
  OTP_INVALID: '잘못된 인증코드입니다. 다시 시도하세요.',
  OTP_EXPIRED: '인증코드가 만료되었습니다. 재전송해 주세요.',
  OTP_MAX_ATTEMPTS: '인증 시도 횟수를 초과했습니다. 재전송해 주세요.',
};

const DEFAULT_ERROR_MESSAGE = '인증에 실패했습니다. 다시 시도하세요.';

interface UseVerificationCodeOptions {
  onSendCode: (phone: string) => Promise<void>;
  onVerifyCode: (phone: string, code: string) => Promise<boolean | string>;
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
  const [errorMessage, setErrorMessage] = useState('');
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
          setStatus(current => {
            if (current === 'verified') {
              return current;
            }
            setErrorMessage(OTP_ERROR_MESSAGES.OTP_EXPIRED);
            return 'expired';
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, duration]);

  //---------------------------------------
  const sendCode = useCallback(
    async (phone: string) => {
      try {
        await onSendCode(phone);
        setCode('');
        setStatus('sent');
        setErrorMessage('');
        setIsVisible(true);
        startTimer();
      } catch {
        // toast is handled by toastMiddleware
      }
    },
    [onSendCode, startTimer],
  );

  //---------------------------------------
  const verifyCode = useCallback(
    async (phone: string) => {
      const result = await onVerifyCode(phone, code);
      if (result === true) {
        setStatus('verified');
        setErrorMessage('');
        clearTimer();
      } else {
        const errorCode = typeof result === 'string' ? result : '';
        setErrorMessage(
          OTP_ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR_MESSAGE,
        );
        setStatus(errorCode === 'OTP_EXPIRED' ? 'expired' : 'error');
      }
    },
    [code, onVerifyCode, clearTimer],
  );

  //---------------------------------------
  const resend = useCallback(
    async (phone: string) => {
      try {
        await onSendCode(phone);
        setCode('');
        setStatus('sent');
        setErrorMessage('');
        startTimer();
      } catch {
        // toast is handled by toastMiddleware
      }
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
    errorMessage,
    remainingSeconds,
    sendCode,
    verifyCode,
    resend,
  };
};
