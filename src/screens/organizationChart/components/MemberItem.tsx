import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { CloseCircle } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import type { TMember } from '../type';

interface IProps {
  member: TMember;
  showRole?: boolean;
  isEditing?: boolean;
  onPressRemove?: () => void;
}

//---------------------------------------
const MemberItem: React.FC<IProps> = ({
  member,
  showRole = false,
  isEditing = false,
  onPressRemove,
}) => {
  if (showRole) {
    return (
      <View style={styles.leaderRow}>
        {member.avatarUrl ? (
          <Image
            source={{ uri: member.avatarUrl }}
            style={styles.leaderAvatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.leaderAvatarPlaceholder}>
            <AppText variant="body8" color={AppColors.white}>
              {member.fullName.charAt(0)}
            </AppText>
          </View>
        )}

        <AppText variant="body6" color={AppColors.gray90}>
          {member.fullName}
        </AppText>

        {member.isMe && (
          <View style={styles.meBadge}>
            <AppText variant="detail" color={AppColors.purple}>
              나
            </AppText>
          </View>
        )}

        <View style={styles.dot} />

        <AppText variant="detail" color={AppColors.gray70}>
          {member.role}
        </AppText>

        {isEditing && !member.isMe && (
          <Pressable hitSlop={8} onPress={onPressRemove}>
            <CloseCircle
              size={`${ms(16)}`}
              color={AppColors.gray50}
              variant="Bold"
            />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.gridItem}>
      {member.avatarUrl ? (
        <Image
          source={{ uri: member.avatarUrl }}
          style={styles.gridAvatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.gridAvatarPlaceholder}>
          <AppText variant="body8" color={AppColors.white}>
            {member.fullName.charAt(0)}
          </AppText>
        </View>
      )}

      <View style={styles.nameRow}>
        <AppText variant="body7" color={AppColors.gray90} numberOfLines={1}>
          {member.fullName}
        </AppText>

        {member.isMe && (
          <View style={styles.meBadge}>
            <AppText variant="detail" color={AppColors.purple}>
              나
            </AppText>
          </View>
        )}

        {isEditing && !member.isMe && (
          <Pressable hitSlop={8} onPress={onPressRemove}>
            <CloseCircle
              size={`${ms(16)}`}
              color={AppColors.gray50}
              variant="Bold"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export const MemoMemberItem = React.memo(MemberItem);

//---------------------------------------
const styles = StyleSheet.create({
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  leaderAvatar: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(16),
  },
  leaderAvatarPlaceholder: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: AppColors.gray90,
    alignSelf: 'center',
  },
  gridItem: {
    alignItems: 'center',
    gap: ms(4),
  },
  gridAvatar: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(18),
  },
  gridAvatarPlaceholder: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(18),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meBadge: {
    backgroundColor: AppColors.pastelLavendar,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(2),
  },
});
