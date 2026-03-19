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

import { authApi } from './api/auth.api';
import { bulletinApi } from './api/bulletin.api';
import { checkinApi } from './api/checkin.api';
import { dataRoomApi } from './api/dataRoom.api';
import { meetingLogApi } from './api/meetingLog.api';
import { meetingScheduleManagementApi } from './api/meetingScheduleManagement.api';
import { scheduleApi } from './api/schedule.api';
import { toastMiddleware } from './middleware/toastMiddleware';
import dataRoomReducer from './slices/dataRoomSlice';
import meetingMinutesReducer from './slices/meetingMinutesSlice';
import meetingScheduleReducer from './slices/meetingScheduleSlice';
import scheduleReducer from './slices/scheduleSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['dataRoom'],
};

const rootReducer = combineReducers({
  dataRoom: dataRoomReducer,
  meetingMinutes: meetingMinutesReducer,
  meetingSchedule: meetingScheduleReducer,
  schedule: scheduleReducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [checkinApi.reducerPath]: checkinApi.reducer,
  [dataRoomApi.reducerPath]: dataRoomApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [bulletinApi.reducerPath]: bulletinApi.reducer,
  [meetingScheduleManagementApi.reducerPath]:
    meetingScheduleManagementApi.reducer,
  [meetingLogApi.reducerPath]: meetingLogApi.reducer,
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
      .concat(authApi.middleware)
      .concat(scheduleApi.middleware)
      .concat(checkinApi.middleware)
      .concat(dataRoomApi.middleware)
      .concat(bulletinApi.middleware)
      .concat(meetingScheduleManagementApi.middleware)
      .concat(meetingLogApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
