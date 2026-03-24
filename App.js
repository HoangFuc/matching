import AppNavigator from './src/navigation/AppNavigator';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { usePerformanceMonitorDevTools } from '@rozenite/performance-monitor-plugin';
import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ToastProvider } from './src/providers/ToastProvider';
import { MemoUpdateRequiredProvider } from './src/providers/UpdateRequiredProvider';
import { store, persistor } from './src/store';
const queryClient = new QueryClient();

export default function App() {
  useNetworkActivityDevTools();
  usePerformanceMonitorDevTools();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#6B1FAD" barStyle="light-content" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <ToastProvider>
                  <MemoUpdateRequiredProvider>
                    <AppNavigator />
                  </MemoUpdateRequiredProvider>
                </ToastProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
