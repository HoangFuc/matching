import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Edit2 } from '@/src/constants/icons';

interface IPersonalInfoSectionProps {
  name: string;
  phone: string;
  team: string;
  position: string;
  onPressEdit?: () => void;
}

//---------------------------------------
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.infoRow}>
    <AppText variant="body7" color={AppColors.gray60} style={styles.label}>
      {label}
    </AppText>
    <AppText variant="body7" color={AppColors.gray90} style={styles.value}>
      {value}
    </AppText>
  </View>
);

//---------------------------------------
const PersonalInfoSection: React.FC<IPersonalInfoSectionProps> = ({
  name,
  phone,
  team,
  position,
  onPressEdit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="body1" color={AppColors.gray90}>
          개인 정보
        </AppText>

        {onPressEdit && (
          <Pressable hitSlop={8} onPress={onPressEdit}>
            <Edit2
              size={`${ms(20)}`}
              color={AppColors.gray60}
              variant="Linear"
            />
          </Pressable>
        )}
      </View>

      <View style={styles.rows}>
        <InfoRow label="이름" value={name} />
        <InfoRow label="휴대폰 번호" value={phone} />
        <InfoRow label="소속 팀" value={team} />
        <InfoRow label="직책" value={position} />
      </View>
    </View>
  );
};

export const MemoPersonalInfoSection = React.memo(PersonalInfoSection);

const styles = StyleSheet.create({
  container: {
    paddingVertical: ms(20),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  rows: {
    gap: ms(12),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: ms(90),
  },
  value: {
    flex: 1,
  },
});
