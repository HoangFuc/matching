import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { TMember } from '../type';

//---------------------------------------
const MemberItem: React.FC<{ member: TMember }> = ({ member }) => {
  return (
    <View style={styles.memberItem}>
      {member.avatarUrl ? (
        <Image
          source={{ uri: member.avatarUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.avatarCircle}>
          <AppText variant="body7" color={AppColors.white}>
            {member.fullName.charAt(0)}
          </AppText>
        </View>
      )}

      <View style={styles.memberInfo}>
        <View style={styles.nameRow}>
          <AppText variant="body7" color={AppColors.gray90}>
            {member.fullName}
          </AppText>

          {member.isMe && (
            <>
              <View style={styles.dot} />

              <View style={styles.meBadge}>
                <AppText variant="detail" color={AppColors.purple}>
                  저
                </AppText>
              </View>
            </>
          )}
        </View>

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
  avatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  dot: {
    width: ms(2),
    height: ms(2),
    borderRadius: ms(1),
    backgroundColor: AppColors.gray80,
  },
  meBadge: {
    backgroundColor: AppColors.lavendar,
    borderRadius: ms(100),
    paddingHorizontal: ms(4),
    paddingVertical: ms(2),
  },
});
