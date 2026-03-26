import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Edit2 } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import { MemoBaseCard } from '@/src/component/BaseCard';

interface IProfileCardProps {
  avatarUrl?: string | null;
  name: string;
  companyName: string;
  roleName: string;
}

const ProfileCard: React.FC<IProfileCardProps> = ({
  avatarUrl,
  name,
  companyName,
  roleName,
}) => {
  return (
    <MemoBaseCard style={styles.container}>
      <View style={styles.avatarWrapper}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Image source={AppImages.avatar} style={styles.avatar} />
        )}

        <Pressable style={styles.editBadge}>
          <Edit2 size={`${ms(15)}`} color={AppColors.black} variant="Linear" />
        </Pressable>
      </View>

      <View style={styles.textWrapper}>
        <AppText variant="heading3" color={AppColors.gray90}>
          {name}
        </AppText>

        <AppText variant="body8" color={AppColors.gray90}>
          {companyName} {roleName}
        </AppText>
      </View>
    </MemoBaseCard>
  );
};

export const MemoProfileCard = React.memo(ProfileCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(16),
    gap: ms(8),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(100),
    backgroundColor: AppColors.gray10,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(22),
    height: ms(22),
    borderRadius: ms(100),
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: ms(1),
    borderColor: AppColors.white,
  },
  textWrapper: {
    gap: ms(4),
  },
});
