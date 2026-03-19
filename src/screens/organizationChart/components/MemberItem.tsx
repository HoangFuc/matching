import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { TMember } from '../type';

//---------------------------------------
const MemberItem: React.FC<{ member: TMember }> = ({ member }) => {
  return (
    <View style={styles.memberItem}>
      <View style={styles.avatarCircle}>
        <AppText variant="body7" color={AppColors.white}>
          {member.name.charAt(0)}
        </AppText>
      </View>

      <View style={styles.memberInfo}>
        <AppText variant="body7" color={AppColors.gray90}>
          {member.name}
        </AppText>

        <AppText variant="detail" color={AppColors.gray60}>
          {member.role}
        </AppText>
      </View>
    </View>
  );
};

export const MemoMemberItem = React.memo(MemberItem);

//---------------------------------------
const styles = StyleSheet.create({
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    width: '45%',
  },
  avatarCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    gap: ms(1),
  },
});
