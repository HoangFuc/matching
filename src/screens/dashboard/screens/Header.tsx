import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import Toast from 'react-native-toast-message';

import { AppText } from '@/src/component/AppText';
import FullScreenLoading from '@/src/component/FullScreenLoading';
import { AppColors } from '@/src/constants/colors';
import { HamburgerMenu, Notification } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import { RootStackParamList } from '@/src/interface/tab.interface';
import { getUserInfo, removeToken } from '@/src/services/tokenService';
import { _retrieveData } from '@/src/api/async.storage';
import { useLogoutMutation } from '@/src/store/api/auth.api';

//---------------------------------------
const DAYS_KR = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

//---------------------------------------
const formatDateKR = (timestamp?: string | number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_KR[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
};

//---------------------------------------
const HeaderDashboard: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [logout, { isLoading }] = useLogoutMutation();
  const [fullName, setFullName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [timestamp, setTimestamp] = React.useState<string | number | undefined>();

  //---------------------------------------
  React.useEffect(() => {
    const loadUserInfo = async () => {
      const user = await getUserInfo();
      if (user) {
        setFullName(user.fullName ?? '');
        setAvatarUrl(user.avatarUrl ?? null);
        setTimestamp(user.timestamp ?? user.createdAt);
      }
    };
    loadUserInfo();
  }, []);

  //---------------------------------------
  const handleLogout = React.useCallback(async () => {
    try {
      const refreshToken = await _retrieveData('refresh_token');
      if (refreshToken) {
        await logout({ refreshToken }).unwrap();
      }
    } catch {
      // Continue with local logout even if API call fails
    } finally {
      await removeToken();
      Toast.show({ type: 'success', text1: '로그아웃되었습니다' });
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    }
  }, [logout, navigation]);

  return (
    <>
      <ImageBackground source={AppImages.headerBg} resizeMode="cover">
        <View style={styles.logo}>
          <Image
            style={{
              width: ms(47),
              aspectRatio: 47 / 24,
            }}
            resizeMode="contain"
            source={AppImages.matchingLogo}
          />

          <View style={styles.action}>
            <Notification size={`${ms(24)}`} color={`${AppColors.white}`} />

            <Pressable onPress={() => navigation.navigate('MyPage')}>
              <HamburgerMenu size={`${ms(24)}`} color={`${AppColors.white}`} />
            </Pressable>
          </View>
        </View>

        <View style={styles.info}>
          <Pressable onPress={handleLogout}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]} />
            )}
          </Pressable>

          <View>
            <AppText variant="detail" color={AppColors.white}>
              {formatDateKR(timestamp)}
            </AppText>

            <AppText variant="heading3" color={AppColors.white}>
              {fullName}님 안녕하세요
            </AppText>
          </View>
        </View>
      </ImageBackground>

      <FullScreenLoading visible={isLoading} />
    </>
  );
};

export const MemoHeaderDashboard = React.memo(HeaderDashboard);

const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
  },
  action: {
    flexDirection: 'row',
    gap: ms(16),
  },
  background: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '120%',
    height: '170%',
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
  },
  avatarPlaceholder: {
    backgroundColor: AppColors.gray20,
  },
  info: {
    flexDirection: 'row',
    paddingHorizontal: ms(16),
    gap: ms(8),
    paddingBottom: ms(24),
  },
});
