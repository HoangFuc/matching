import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoChip } from '@/src/component/Chip';
import { AppColors } from '@/src/constants/colors';
import {
  MEETING_BADGE_CONFIG,
  MEETING_TYPE_CONFIG,
} from '@/src/constants/meetingMinutes';
import { TMeetingMinutes } from '@/src/interface/meetingMinutes.interface';

interface IProps {
  item: TMeetingMinutes;
  onPress?: () => void;
}

const MeetingCard: React.FC<IProps> = ({ item, onPress }) => {
  const typeConfig = MEETING_TYPE_CONFIG[item.type];
  const badgeConfig = MEETING_BADGE_CONFIG['녹취미팅'];

  return (
    <MemoBaseCard style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <View style={styles.badges}>
            <MemoChip
              label={item.type}
              bgColor={typeConfig.bgColor}
              textColor={typeConfig.textColor}
              textVariant="detail"
            />
            {item.isRecorded && (
              <MemoChip
                label="분석정보"
                bgColor={badgeConfig.bgColor}
                textColor={badgeConfig.textColor}
                textVariant="detail"
              />
            )}
          </View>

          <AppText variant="body6" color={AppColors.gray90} numberOfLines={1}>
            {item.title}
          </AppText>

          <AppText variant="body8" color={AppColors.gray90}>
            {item.customerName}
          </AppText>
        </View>

        <View style={styles.actionButtons}>
          <Pressable style={styles.actionAnalysis}>
            <AppText
              variant="body7"
              color={AppColors.purple}
              style={styles.text}
            >
              분석정보
            </AppText>
          </Pressable>

          <Pressable style={[styles.actionTrend]}>
            <AppText
              variant="body7"
              color={AppColors.purple}
              style={styles.text}
            >
              성향
            </AppText>
          </Pressable>
        </View>
      </View>
    </MemoBaseCard>
  );
};

export const MemoMeetingCard = React.memo(MeetingCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(6),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    gap: ms(6),
  },
  badges: {
    flexDirection: 'row',
    gap: ms(4),
  },
  actionButtons: {
    gap: ms(4),
    justifyContent: 'center',
  },
  actionAnalysis: {
    borderRadius: ms(6),
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.lavendar,
  },
  actionTrend: {
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: AppColors.purple,
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    gap: ms(10),
    backgroundColor: AppColors.white,
  },
  text: {
    textAlign: 'center',
  },
});
