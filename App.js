import { useEffect, useRef } from 'react';
import AppNavigator from './src/navigation/AppNavigator';

import { StatusBar, AppState } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ToastProvider } from './src/providers/ToastProvider';
import { store, persistor } from './src/store';
import { initToken, removeToken } from './src/services/tokenService';

const queryClient = new QueryClient();

export default function App() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initToken();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        removeToken();
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        initToken();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#6B1FAD" barStyle="light-content" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <ToastProvider>
                  <AppNavigator />
                </ToastProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
