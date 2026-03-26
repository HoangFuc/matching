import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Add } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import type { TDirector } from '../type';

interface IProps {
  directors: TDirector[];
}

//---------------------------------------
const DirectorCard: React.FC<{ director: TDirector }> = ({ director }) => {
  return (
    <View style={[styles.card, director.isMe && styles.cardActive]}>
      {director.isMe && (
        <Image
          source={AppImages.star1}
          style={styles.starImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.avatarWrapper}>
        {director.avatarUrl ? (
          <Image
            source={{ uri: director.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <AppText variant="body5" color={AppColors.white}>
              {director.fullName.charAt(0)}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <AppText variant="body7" color={AppColors.gray90}>
            {director.fullName}
          </AppText>

          {director.isMe && (
            <View style={styles.meBadge}>
              <AppText variant="detail" color={AppColors.purple}>
                나
              </AppText>
            </View>
          )}
        </View>

        <AppText variant="detail" color={AppColors.gray60}>
          {director.role}
        </AppText>
      </View>
    </View>
  );
};

//---------------------------------------
const PlaceholderCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.placeholderCircle}>
        <Add size={`${ms(20)}`} color={AppColors.gray40} variant="Linear" />
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <AppText variant="body6" color={AppColors.gray40}>
            총괄 2
          </AppText>

          <View style={styles.addBadge}>
            <Add size={`${ms(10)}`} color={AppColors.gray40} variant="Linear" />
          </View>
        </View>

        <View style={styles.placeholderLine} />
      </View>
    </View>
  );
};

//---------------------------------------
const DirectorsSection: React.FC<IProps> = ({ directors }) => {
  const director1 = directors[0] ?? null;
  const director2 = directors.length > 1 ? directors[1] : null;

  if (!director1 && !director2) {
    return null;
  }

  return (
    <View style={styles.container}>
      {director1 && <DirectorCard director={director1} />}

      {director2 ? <DirectorCard director={director2} /> : <PlaceholderCard />}
    </View>
  );
};

export const MemoDirectorsSection = React.memo(DirectorsSection);

//---------------------------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: ms(12),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    backgroundColor: AppColors.white,
    borderRadius: ms(14),
    borderWidth: ms(1),
    borderColor: AppColors.gray30,
    padding: ms(8),
  },
  cardActive: {
    borderColor: AppColors.purple,
    borderWidth: ms(2),
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(22),
  },
  avatarPlaceholder: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starImage: {
    position: 'absolute',
    top: ms(6),
    right: ms(6),
    width: ms(11),
    height: ms(10),
    zIndex: 1,
  },
  infoWrapper: {
    flex: 1,
    gap: ms(2),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  meBadge: {
    backgroundColor: AppColors.pastelLavendar,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
  },
  placeholderCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: AppColors.gray20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBadge: {
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    borderWidth: ms(1),
    borderColor: AppColors.gray30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLine: {
    height: ms(1),
    backgroundColor: AppColors.gray30,
    marginTop: ms(4),
  },
});
