import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
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
  onSelectRole: (id: string, option: TDropdownOption) => void;
  onSelectLocation: (id: string, option: TDropdownOption) => void;
  onSelectExpiry: (id: string, option: TDropdownOption) => void;
  onGenerateLink: (id: string) => void;
  isGeneratingLink: boolean;
}

//---------------------------------------
const InviteCard: React.FC<IProps> = ({
  invite,
  roleOptions,
  locationOptions,
  locationDisabled,
  expiryOptions,
  onSelectRole,
  onSelectLocation,
  onSelectExpiry,
  onGenerateLink,
  isGeneratingLink,
}) => {
  const canGenerate = invite.role !== '' && invite.expiry !== '';
  const hasLink = invite.generatedLink !== '';

  return (
    <View>
      <MemoBaseCard style={[styles.card, hasLink && styles.cardConnected]}>
        <MemoInviteDropdownField
          label="초대 대상 직책"
          value={invite.role}
          placeholder="직책 선택"
          options={roleOptions}
          onSelect={option => onSelectRole(invite.id, option)}
        />

        <MemoInviteDropdownField
          label="소속 위치"
          value={invite.location}
          placeholder="소속 위치 선택"
          options={locationOptions}
          disabled={locationDisabled}
          onSelect={option => onSelectLocation(invite.id, option)}
        />

        <MemoInviteDropdownField
          label="링크 만료 기간"
          value={invite.expiry}
          placeholder="만료 기간 선택"
          options={expiryOptions}
          onSelect={option => onSelectExpiry(invite.id, option)}
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
});
