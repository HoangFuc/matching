import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AppAlert, {TAlertType} from '@/src/component/AppAlert';
import {setGlobalToast} from '@/src/utils/toastDispatcher';

interface IToastContext {
  showToast: (params: {
    type: TAlertType;
    title?: string;
    message?: string;
  }) => void;
}

export const ToastContext = createContext<IToastContext>({
  showToast: () => {},
});

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
  const [toast, setToast] = useState<{
    type: TAlertType;
    title?: string;
    message?: string;
  } | null>(null);

  const anim = useRef({
    opacity: useSharedValue(0),
    translateY: useSharedValue(-20),
  }).current;

  const insets = useSafeAreaInsets();

  const showToast = useCallback(
    ({
      type,
      title,
      message,
    }: {
      type: TAlertType;
      title?: string;
      message?: string;
    }) => {
      setToast({type, title, message});
    },
    [],
  );

  // Register global toast (once)
  useEffect(() => {
    setGlobalToast((type, title, message) => {
      showToast({type, title, message});
    });
  }, [showToast]);

  // Animation lifecycle
  useEffect(() => {
    if (!toast) {
      return;
    }

    anim.opacity.value = withTiming(1, {duration: 250});
    anim.translateY.value = withTiming(0, {duration: 250});

    const timer = setTimeout(() => {
      anim.opacity.value = withTiming(0, {duration: 250});
      anim.translateY.value = withTiming(-20, {duration: 250});

      setTimeout(() => setToast(null), 250);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, anim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: anim.opacity.value,
    transform: [{translateY: anim.translateY.value}],
  }));

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}

      {toast && (
        <Animated.View
          style={[styles.toastWrapper, animatedStyle, {top: insets.top}]}>
          <AppAlert
            type={toast.type}
            title={toast.title}
            message={toast.message}
          />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
  },
});
