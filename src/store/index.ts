import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import {dataRoomApi} from './api/dataRoom.api';
import dataRoomReducer from './slices/dataRoomSlice';
import {toastMiddleware} from './middleware/toastMiddleware';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['dataRoom'],
};

const rootReducer = combineReducers({
  dataRoom: dataRoomReducer,
  // TODO: 실제 API 연결 시 uncomment
  // [dataRoomApi.reducerPath]: dataRoomApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(toastMiddleware),
    // TODO: 실제 API 연결 시 .concat(dataRoomApi.middleware) 추가
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
