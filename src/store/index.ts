import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
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

import { bulletinApi } from './api/bulletin.api';
import {dataRoomApi} from './api/dataRoom.api';
import { checkinApi } from './api/checkin.api';
import { scheduleApi } from './api/schedule.api';
import { toastMiddleware } from './middleware/toastMiddleware';
import dataRoomReducer from './slices/dataRoomSlice';
import scheduleReducer from './slices/scheduleSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['dataRoom'],
};

const rootReducer = combineReducers({
  dataRoom: dataRoomReducer,
  schedule: scheduleReducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [checkinApi.reducerPath]: checkinApi.reducer,
  [dataRoomApi.reducerPath]: dataRoomApi.reducer,
  [bulletinApi.reducerPath]: bulletinApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(toastMiddleware)
      .concat(scheduleApi.middleware)
      .concat(checkinApi.middleware)
      .concat(dataRoomApi.middleware)
      .concat(bulletinApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
