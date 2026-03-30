import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Add, CloseCircle } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import { useOrgEditActions } from '../context/OrgEditContext';
import type { TDirector, TMember } from '../type';
import { MemoAddMemberSheet } from './AddMemberSheet';

interface IProps {
  directors: TDirector[];
  totalMembers: number;
  isEditing?: boolean;
  canEdit?: boolean;
  isSingleDirectorCompany?: boolean;
}

//---------------------------------------
const DirectorCard: React.FC<{
  director: TDirector;
  isEditing?: boolean;
  onPressRemove?: () => void;
}> = ({ director, isEditing = false, onPressRemove }) => {
  return (
    <View
      style={[styles.card, director.isMe && !isEditing && styles.cardActive]}
    >
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

      <Pressable
        hitSlop={8}
        disabled={!isEditing}
        onPress={onPressRemove}
        style={!isEditing && styles.hidden}
      >
        <CloseCircle
          size={`${ms(16)}`}
          color={AppColors.gray50}
          variant="Bold"
        />
      </Pressable>
    </View>
  );
};

//---------------------------------------
const PlaceholderCard: React.FC<{ onPressAdd?: () => void }> = ({
  onPressAdd,
}) => {
  return (
    <Pressable style={styles.placeholderCard} onPress={onPressAdd}>
      <AppText variant="body6" color={AppColors.gray70}>
        총괄 2
      </AppText>

      <View style={styles.placeholderAddButton}>
        <Add size={`${ms(12)}`} color={AppColors.gray50} variant="Linear" />
      </View>
    </Pressable>
  );
};

//---------------------------------------
const DirectorsSection: React.FC<IProps> = ({
  directors,
  totalMembers,
  isEditing = false,
  canEdit = false,
  isSingleDirectorCompany = false,
}) => {
  const actions = useOrgEditActions();
  const effectiveEditing = isEditing && canEdit;
  const [addMemberVisible, setAddMemberVisible] = React.useState(false);
  const director1 = directors[0] ?? null;
  const director2 = directors.length > 1 ? directors[1] : null;

  //---------------------------------------
  const handlePressAddMember = React.useCallback(() => {
    setAddMemberVisible(true);
  }, []);

  //---------------------------------------
  const handleCloseAddMember = React.useCallback(() => {
    setAddMemberVisible(false);
  }, []);

  //---------------------------------------
  const handleConfirmAddMember = React.useCallback((member: TMember) => {
    actions.addDirector(member);
  }, [actions]);

  //---------------------------------------
  const handleRemoveDirector = React.useCallback(
    (memberId: string) => {
      actions.removeDirector(memberId);
    },
    [actions],
  );

  if (!director1 && !director2) {
    return null;
  }

  return (
    <View style={styles.container}>
      {director1 && (
        <DirectorCard
          director={director1}
          isEditing={effectiveEditing}
          onPressRemove={() => handleRemoveDirector(director1.memberId)}
        />
      )}

      {director2 ? (
        <DirectorCard
          director={director2}
          isEditing={effectiveEditing}
          onPressRemove={() => handleRemoveDirector(director2.memberId)}
        />
      ) : effectiveEditing && !isSingleDirectorCompany && totalMembers > 1 ? (
        <PlaceholderCard onPressAdd={handlePressAddMember} />
      ) : null}

      <MemoAddMemberSheet
        visible={addMemberVisible}
        onClose={handleCloseAddMember}
        onConfirm={handleConfirmAddMember}
      />
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
  placeholderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
    backgroundColor: AppColors.white,
    borderRadius: ms(14),
    borderWidth: ms(1),
    borderColor: AppColors.gray30,
    paddingVertical: ms(14),
    paddingHorizontal: ms(12),
  },
  placeholderAddButton: {
    width: ms(24),
    height: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.gray20,
    borderRadius: ms(100),
    padding: ms(4),
  },
  hidden: {
    opacity: 0,
  },
  placeholderLine: {
    flex: 1,
    height: ms(2),
    backgroundColor: AppColors.gray80,
    borderRadius: ms(1),
  },
});
