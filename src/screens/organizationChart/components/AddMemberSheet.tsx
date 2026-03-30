import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBottomSheetModal } from '@/src/component/BottomSheetModal';
import { AppColors } from '@/src/constants/colors';
import { useGetMembersQuery } from '@/src/store/api/company.api';
import type { TMember } from '../type';

interface IProps {
  visible: boolean;
  disabledMemberIds?: string[];
  onClose: () => void;
  onConfirm: (member: TMember) => void;
}

//---------------------------------------
const MemberRow: React.FC<{
  member: TMember;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
}> = ({ member, isSelected, isDisabled, onPress }) => {
  return (
    <Pressable
      style={[styles.memberRow, isDisabled && styles.memberRowDisabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.memberInfo}>
        {member.avatarUrl ? (
          <Image
            source={{ uri: member.avatarUrl }}
            style={[styles.avatar, isDisabled && styles.avatarDisabled]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              isDisabled && styles.avatarDisabled,
            ]}
          >
            <AppText variant="body8" color={AppColors.white}>
              {member.fullName.charAt(0)}
            </AppText>
          </View>
        )}

        <AppText
          variant={isSelected ? 'body1' : 'body4'}
          color={
            isDisabled
              ? AppColors.gray40
              : isSelected
                ? AppColors.purple
                : AppColors.gray90
          }
        >
          {member.fullName}
        </AppText>

        <View
          style={[
            styles.dot,
            isSelected && { backgroundColor: AppColors.purple },
            isDisabled && { backgroundColor: AppColors.gray40 },
          ]}
        />

        <AppText
          variant="body4"
          color={
            isDisabled
              ? AppColors.gray40
              : isSelected
                ? AppColors.purple
                : AppColors.gray70
          }
        >
          {member.role}
        </AppText>

        {(() => {
          const hasDept = !!member.departmentName;
          const hasTeam = !!member.teamName;
          const label = member.teamName ?? member.departmentName;
          if (!label) {
            return null;
          }
          const isUnassigned = label === '미배정';
          const badgeStyle = isUnassigned
            ? styles.teamBadgeUnassigned
            : hasTeam
              ? styles.teamBadgeTeam
              : hasDept
                ? styles.teamBadgeDept
                : null;
          const textColor = isUnassigned
            ? AppColors.gray60
            : hasTeam
              ? AppColors.strongBlue
              : AppColors.green;
          return (
            <View style={[styles.teamBadge, badgeStyle]}>
              <AppText variant="detail" color={textColor}>
                {label}
              </AppText>
            </View>
          );
        })()}
      </View>

      {isSelected && (
        <View style={[styles.radioOuter, styles.radioOuterSelected]}>
          <View style={styles.radioInner} />
        </View>
      )}
    </Pressable>
  );
};

//---------------------------------------
const AddMemberSheet: React.FC<IProps> = ({
  visible,
  disabledMemberIds = [],
  onClose,
  onConfirm,
}) => {
  const { data: memberGroups = [], isLoading } = useGetMembersQuery(undefined, {
    skip: !visible,
  });
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  //---------------------------------------
  const handleClose = React.useCallback(() => {
    setSelectedId(null);
    onClose();
  }, [onClose]);

  //---------------------------------------
  const handleConfirm = React.useCallback(() => {
    if (!selectedId) {
      return;
    }
    for (const group of memberGroups) {
      const found = group.members.find(
        (m: TMember) => m.memberId === selectedId,
      );
      if (found) {
        onConfirm(found);
        break;
      }
    }
    setSelectedId(null);
    onClose();
  }, [selectedId, memberGroups, onConfirm, onClose]);

  //---------------------------------------
  React.useEffect(() => {
    if (visible) {
      setSelectedId(null);
    }
  }, [visible]);

  return (
    <MemoBottomSheetModal
      visible={visible}
      onClose={handleClose}
      title="멤버 추가"
      sheetStyle={styles.sheet}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.purple} />
        </View>
      ) : memberGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText variant="body4" color={AppColors.gray50}>
            초대 목록이 비어 있습니다
          </AppText>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {memberGroups.map(group => (
            <View key={group.role} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <AppText variant="body1" color={AppColors.gray90}>
                  {`${group.role}`}
                </AppText>

                <AppText variant="body4" color={AppColors.gray90}>
                  {` (멤버 ${group.members.length}명)`}
                </AppText>
              </View>

              {group.members.map(member => (
                <MemberRow
                  key={member.memberId}
                  member={member}
                  isSelected={selectedId === member.memberId}
                  isDisabled={disabledMemberIds.includes(member.memberId)}
                  onPress={() =>
                    setSelectedId(prev =>
                      prev === member.memberId ? null : member.memberId,
                    )
                  }
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonGroup}>
        <View style={styles.buttonWrapper}>
          <MemoAppButton
            label="취소"
            variant="secondary"
            onPress={handleClose}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <MemoAppButton
            label="확인"
            variant="primary"
            onPress={handleConfirm}
            disabled={!selectedId}
          />
        </View>
      </View>
    </MemoBottomSheetModal>
  );
};

export const MemoAddMemberSheet = React.memo(AddMemberSheet);

//---------------------------------------
const styles = StyleSheet.create({
  sheet: {
    maxHeight: '100%',
    paddingBottom: ms(10),
  },
  loadingContainer: {
    height: ms(200),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyContainer: {
    height: ms(200),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  scrollView: {
    maxHeight: ms(450),
    width: '100%',
  },
  scrollContent: {
    paddingBottom: ms(8),
  },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray20,
    paddingBottom: ms(16),
    gap: ms(12),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
  },
  memberRowDisabled: {
    opacity: 0.4,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    flex: 1,
  },
  avatar: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(16),
  },
  avatarPlaceholder: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDisabled: {
    opacity: 0.6,
  },
  dot: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: AppColors.gray90,
  },
  teamBadge: {
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(2),
  },
  teamBadgeDept: {
    backgroundColor: AppColors.lightLime,
  },
  teamBadgeTeam: {
    backgroundColor: AppColors.lightBlue,
  },
  teamBadgeUnassigned: {
    backgroundColor: AppColors.gray10,
  },
  radioOuter: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    borderWidth: ms(2),
    borderColor: AppColors.gray30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: AppColors.purple,
  },
  radioInner: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: AppColors.purple,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: ms(8),
    paddingTop: ms(16),
    paddingHorizontal: ms(16),
  },
  buttonWrapper: {
    flex: 1,
  },
});
