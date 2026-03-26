import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

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
    <AppText variant="body6" color={AppColors.gray90} style={styles.label}>
      {label}
    </AppText>
    <AppText variant="body8" color={AppColors.gray90} style={styles.value}>
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
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rows}>
        <InfoRow label="이름" value={name} />

        <InfoRow
          label="휴대폰 번호"
          value={phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
        />

        <InfoRow label="소속 팀" value={team} />

        <InfoRow label="직책" value={position} />
      </View>
    </View>
  );
};

export const MemoPersonalInfoSection = React.memo(PersonalInfoSection);

const styles = StyleSheet.create({
  container: {
    gap: ms(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
