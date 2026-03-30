import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

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
    <View style={styles.container}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <AppText variant="heading2" color={AppColors.white}>
            {name.charAt(0)}
          </AppText>
        </View>
      )}

      <AppText variant="heading2" color={AppColors.gray90}>
        {name}
      </AppText>

      <AppText variant="body7" color={AppColors.gray60}>
        {companyName} {roleName}
      </AppText>
    </View>
  );
};

export const MemoProfileCard = React.memo(ProfileCard);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: ms(24),
    gap: ms(4),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
  },
  avatar: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    marginBottom: ms(8),
  },
  avatarPlaceholder: {
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
