/**
 * Tests for useVerificationCode hook logic.
 *
 * Since @testing-library/react-hooks is not available, we test
 * the exported constants and error-message mapping directly,
 * and validate the timer/state logic via a minimal React renderer.
 */
import React from 'react';
import {create, act} from 'react-test-renderer';
import {useVerificationCode} from '@/src/hooks/useVerificationCode';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));

// Minimal component to exercise the hook
function TestComponent({
  onSendCode,
  onVerifyCode,
  duration,
}: {
  onSendCode: (phone: string) => Promise<void>;
  onVerifyCode: (phone: string, code: string) => Promise<boolean | string>;
  duration?: number;
}) {
  const hook = useVerificationCode({onSendCode, onVerifyCode, duration});

  return React.createElement('View', {'testID': 'hook-output', ...hook});
}

const getHookProps = (renderer: ReturnType<typeof create>) => {
  const root = renderer.root.findByProps({testID: 'hook-output'});
  return root.props;
};

describe('useVerificationCode', () => {
  let mockSendCode: jest.Mock;
  let mockVerifyCode: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSendCode = jest.fn().mockResolvedValue(undefined);
    mockVerifyCode = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  //---------------------------------------
  it('initializes with default state', () => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    const props = getHookProps(renderer!);
    expect(props.isVisible).toBe(false);
    expect(props.status).toBe('sent');
    expect(props.code).toBe('');
    expect(props.errorMessage).toBe('');
    expect(props.remainingSeconds).toBe(120);
  });

  //---------------------------------------
  it('sets isVisible to true after sendCode', async () => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.isVisible).toBe(true);
    expect(props.status).toBe('sent');
    expect(mockSendCode).toHaveBeenCalledWith('01012345678');
  });

  //---------------------------------------
  it('counts down timer after sendCode', async () => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
          duration: 5,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    expect(getHookProps(renderer!).remainingSeconds).toBe(5);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getHookProps(renderer!).remainingSeconds).toBe(3);
  });

  //---------------------------------------
  it('sets expired status when timer reaches 0', async () => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
          duration: 3,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    const props = getHookProps(renderer!);
    expect(props.remainingSeconds).toBe(0);
    expect(props.status).toBe('expired');
    expect(props.errorMessage).toBe('잘못된 인증코드입니다. 다시 시도하세요.');
  });

  //---------------------------------------
  it('sets verified status on successful verification', async () => {
    mockVerifyCode.mockResolvedValue(true);

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    // Set code
    act(() => {
      getHookProps(renderer!).setCode('123456');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.status).toBe('verified');
    expect(props.errorMessage).toBe('');
  });

  //---------------------------------------
  it('sets error status with OTP_INVALID message', async () => {
    mockVerifyCode.mockResolvedValue('OTP_INVALID');

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.status).toBe('error');
    expect(props.errorMessage).toBe('잘못된 인증코드입니다. 다시 시도하세요.');
  });

  //---------------------------------------
  it('sets expired status with OTP_EXPIRED error code', async () => {
    mockVerifyCode.mockResolvedValue('OTP_EXPIRED');

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.status).toBe('expired');
    expect(props.errorMessage).toBe('잘못된 인증코드입니다. 다시 시도하세요.');
  });

  //---------------------------------------
  it('sets error with OTP_MAX_ATTEMPTS message', async () => {
    mockVerifyCode.mockResolvedValue('OTP_MAX_ATTEMPTS');

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.status).toBe('error');
    expect(props.errorMessage).toBe('인증 시도 횟수를 초과했습니다. 재전송해 주세요.');
  });

  //---------------------------------------
  it('uses default error message for unknown error codes', async () => {
    mockVerifyCode.mockResolvedValue('UNKNOWN_CODE');

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    expect(getHookProps(renderer!).errorMessage).toBe('인증에 실패했습니다. 다시 시도하세요.');
  });

  //---------------------------------------
  it('resend resets code, status and restarts timer', async () => {
    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
          duration: 10,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(getHookProps(renderer!).remainingSeconds).toBe(5);

    await act(async () => {
      await getHookProps(renderer!).resend('01012345678');
    });

    const props = getHookProps(renderer!);
    expect(props.remainingSeconds).toBe(10);
    expect(props.status).toBe('sent');
    expect(props.code).toBe('');
    expect(mockSendCode).toHaveBeenCalledTimes(2);
  });

  //---------------------------------------
  it('does not expire when already verified', async () => {
    mockVerifyCode.mockResolvedValue(true);

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
          duration: 3,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    expect(getHookProps(renderer!).status).toBe('verified');

    // Timer should have been cleared, but advance anyway
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(getHookProps(renderer!).status).toBe('verified');
  });

  //---------------------------------------
  it('handles sendCode failure gracefully', async () => {
    mockSendCode.mockRejectedValue(new Error('Network error'));

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    // Should remain invisible since send failed
    expect(getHookProps(renderer!).isVisible).toBe(false);
  });

  //---------------------------------------
  it('uses default error message when verifyCode returns false', async () => {
    mockVerifyCode.mockResolvedValue(false);

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        React.createElement(TestComponent, {
          onSendCode: mockSendCode,
          onVerifyCode: mockVerifyCode,
        }),
      );
    });

    await act(async () => {
      await getHookProps(renderer!).sendCode('01012345678');
    });

    await act(async () => {
      await getHookProps(renderer!).verifyCode('01012345678');
    });

    expect(getHookProps(renderer!).errorMessage).toBe('인증에 실패했습니다. 다시 시도하세요.');
  });
});
