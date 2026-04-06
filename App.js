import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { usePerformanceMonitorDevTools } from '@rozenite/performance-monitor-plugin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { MemoSessionExpiredProvider } from './src/providers/SessionExpiredProvider';
import { ToastProvider } from './src/providers/ToastProvider';
import { MemoUpdateRequiredProvider } from './src/providers/UpdateRequiredProvider';
import { persistor, store } from './src/store';
const queryClient = new QueryClient();

export default function App() {
  useNetworkActivityDevTools();
  usePerformanceMonitorDevTools();

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#6B1FAD" barStyle="light-content" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <ToastProvider>
                  <MemoUpdateRequiredProvider>
                    <MemoSessionExpiredProvider>
                      <AppNavigator />
                    </MemoSessionExpiredProvider>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
