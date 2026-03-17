import React from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import {
  useCheckinMutation,
  useGetAttendanceTodayQuery,
} from '@/src/store/api/checkin.api';
import { MemoCheckin } from '../calendarAction/Checkin';
import { MemoSchedule } from '../calendarAction/Schedule';

const CalendarAction: React.FC = () => {
  const { data: attendance } = useGetAttendanceTodayQuery();
  const [checkin, { isLoading }] = useCheckinMutation();

  //---------------------------------------
  const checkinTime = React.useMemo(
    () =>
      attendance?.data?.checkedIn
        ? (attendance.data?.checkInTime?.slice(11, 16) ?? null)
        : null,
    [attendance?.data?.checkedIn, attendance?.data?.checkInTime],
  );

  //---------------------------------------
  const requestLocationPermission =
    React.useCallback(async (): Promise<boolean> => {
      if (Platform.OS === 'ios') {
        return true; // iOS tự hiện popup xin quyền khi gọi getCurrentPosition
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }, []);

  //---------------------------------------
  const getCurrentPosition = React.useCallback(
    (): Promise<{ latitude: number; longitude: number }> =>
      new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          error => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }),
    [],
  );

  //---------------------------------------
  const handleCheckin = React.useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Toast.show({ type: 'error', text1: '위치 권한이 필요합니다' });
        return;
      }

      const { latitude, longitude } = await getCurrentPosition();
      await checkin({ latitude, longitude }).unwrap();
      Toast.show({ type: 'success', text1: '출근 체크에 성공했습니다' });
    } catch {
      Toast.show({ type: 'error', text1: '출근 체크에 실패했습니다' });
    }
  }, [checkin, requestLocationPermission, getCurrentPosition]);

  return (
    <View style={styles.container}>
      <MemoSchedule />

      <MemoCheckin
        checkinTime={checkinTime}
        onCheckin={handleCheckin}
        isLoading={isLoading}
      />
    </View>
  );
};

export const MemoCalendarAction = React.memo(CalendarAction);

const styles = StyleSheet.create({
  container: {
    gap: ms(8),
    flexDirection: 'row',
    paddingBottom: ms(24),
  },
});
