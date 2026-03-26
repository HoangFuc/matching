import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import type {
  RootStackParamList,
  RootTabParamList,
} from '@/src/interface/tab.interface';
import { MemoCommonAction } from '../moreActions/CommonAction';

type TNav = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

const MoreActions: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [showDevModal, setShowDevModal] = useState(false);

  //---------------------------------------
  const handleShowDevModal = useCallback(() => {
    setShowDevModal(true);
  }, []);

  //---------------------------------------
  const handleCloseDevModal = useCallback(() => {
    setShowDevModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        메뉴
      </AppText>

      <View style={styles.grid}>
        <MemoCommonAction
          label="일정"
          style={styles.gridItem}
          image={<Image source={AppImages.calendar} style={styles.icon} />}
          onPress={() =>
            navigation.navigate('Schedule', {
              screen: 'ScheduleMain',
              params: { filterTypes: [] },
            })
          }
        />

        <MemoCommonAction
          label="회의록"
          style={styles.gridItem}
          image={
            <Image source={AppImages.clipboardWithPen} style={styles.icon} />
          }
          onPress={() => navigation.navigate('MeetingMinutes')}
        />

        <MemoCommonAction
          label="자료실"
          style={styles.gridItem}
          image={
            <Image
              source={AppImages.folderWithDocument}
              style={styles.iconSmall}
            />
          }
          onPress={() => navigation.navigate('DataRoom')}
        />

        <MemoCommonAction
          label="팀 게시판"
          style={styles.gridItem}
          image={<Image source={AppImages.bell} style={styles.icon} />}
          onPress={() => navigation.navigate('BulletinBoard')}
        />

        <MemoCommonAction
          label="계약현황"
          style={styles.gridItem}
          image={<Image source={AppImages.clipboard} style={styles.icon} />}
          onPress={handleShowDevModal}
        />

        <MemoCommonAction
          label="뉴스"
          style={styles.gridItem}
          image={<Image source={AppImages.speaker} style={styles.icon} />}
          onPress={handleShowDevModal}
        />

        <MemoCommonAction
          label="기안"
          style={styles.gridItem}
          image={<Image source={AppImages.phoneBook} style={styles.icon} />}
          onPress={handleShowDevModal}
        />
      </View>

      <MemoUnderDevelopmentModal
        visible={showDevModal}
        onClose={handleCloseDevModal}
      />
    </View>
  );
};

export const MemoMoreActions = React.memo(MoreActions);

const styles = StyleSheet.create({
  container: {
    paddingVertical: ms(24),
    gap: ms(12),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  gridItem: {
    width: '23%',
  },
  icon: {
    width: ms(48),
    height: ms(48),
  },
  iconSmall: {
    width: ms(36),
    height: ms(48),
  },
});
