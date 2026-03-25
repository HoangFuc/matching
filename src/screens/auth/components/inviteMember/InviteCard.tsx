import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import type { TInviteLink } from '../../type';
import { MemoGeneratedLinkRow } from './GeneratedLinkRow';
import {
  MemoInviteDropdownField,
  type TDropdownOption,
} from './InviteDropdownField';

interface IProps {
  invite: TInviteLink;
  roleOptions: TDropdownOption[];
  locationOptions: TDropdownOption[];
  locationDisabled: boolean;
  expiryOptions: TDropdownOption[];
  directorLabel?: string;
  onSelectRole: (id: string, option: TDropdownOption) => void;
  onSelectLocation: (id: string, option: TDropdownOption) => void;
  onSelectExpiry: (id: string, option: TDropdownOption) => void;
  onGenerateLink: (id: string) => void;
  onEditOrgChart?: () => void;
  isGeneratingLink: boolean;
}

//---------------------------------------
const InviteCard: React.FC<IProps> = ({
  invite,
  roleOptions,
  locationOptions,
  locationDisabled,
  expiryOptions,
  directorLabel,
  onSelectRole,
  onSelectLocation,
  onSelectExpiry,
  onGenerateLink,
  onEditOrgChart,
  isGeneratingLink,
}) => {
  const canGenerate = invite.role !== '' && invite.expiry !== '';
  const hasLink = invite.generatedLink !== '';
  const isDirector = !!directorLabel;

  return (
    <View>
      <MemoBaseCard style={[styles.card, hasLink && styles.cardConnected]}>
        <MemoInviteDropdownField
          label="초대 대상 직책"
          value={invite.role}
          placeholder="직책 선택"
          options={roleOptions}
          onSelect={option => onSelectRole(invite.id, option)}
          useBottomSheet
        />

        {isDirector ? (
          <View style={[styles.directorRow, styles.directorDisabled]}>
            <AppText variant="body7" color={AppColors.gray90}>
              소속 위치
            </AppText>

            <View style={styles.directorLabelRow}>
              <AppText variant="body8" color={AppColors.gray90}>
                {directorLabel}
              </AppText>
            </View>
          </View>
        ) : (
          <MemoInviteDropdownField
            label="소속 위치"
            value={invite.location}
            placeholder="소속 위치 선택"
            options={locationOptions}
            disabled={locationDisabled}
            onSelect={option => onSelectLocation(invite.id, option)}
            useBottomSheet
          />
        )}

        <MemoInviteDropdownField
          label="링크 만료 기간"
          value={invite.expiry}
          placeholder="만료 기간 선택"
          options={expiryOptions}
          onSelect={option => onSelectExpiry(invite.id, option)}
          useBottomSheet
        />

        <MemoAppButton
          label="링크 생성"
          variant="primary"
          textVariant="body6"
          disabled={!canGenerate}
          loading={isGeneratingLink}
          onPress={() => onGenerateLink(invite.id)}
        />
      </MemoBaseCard>

      {hasLink && (
        <View style={styles.linkContainer}>
          <MemoGeneratedLinkRow link={invite.generatedLink} />
        </View>
      )}
    </View>
  );
};

export const MemoInviteCard = React.memo(InviteCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(12),
  },
  cardConnected: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  linkContainer: {
    backgroundColor: AppColors.lavendar,
    borderBottomLeftRadius: ms(16),
    borderBottomRightRadius: ms(16),
    padding: ms(16),
  },
  directorRow: {
    gap: ms(6),
  },
  directorDisabled: {
    opacity: 0.5,
  },
  directorLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.gray10,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
  },
});
