import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { AppColors } from '@/src/constants/colors';
import type { TInviteLink } from '../../type';
import { MemoGeneratedLinkRow } from './GeneratedLinkRow';
import { MemoInviteDropdownField } from './InviteDropdownField';

interface IProps {
  invite: TInviteLink;
  roleOptions: string[];
  locationOptions: string[];
  expiryOptions: string[];
  onSelectRole: (id: string, value: string) => void;
  onSelectLocation: (id: string, value: string) => void;
  onSelectExpiry: (id: string, value: string) => void;
  onGenerateLink: (id: string) => void;
  onCopy: (id: string) => void;
  onShare: (id: string) => void;
}

//---------------------------------------
const InviteCard: React.FC<IProps> = ({
  invite,
  roleOptions,
  locationOptions,
  expiryOptions,
  onSelectRole,
  onSelectLocation,
  onSelectExpiry,
  onGenerateLink,
  onCopy,
  onShare,
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
          onSelect={value => onSelectRole(invite.id, value)}
        />

        <MemoInviteDropdownField
          label="소속 위치"
          value={invite.location}
          options={locationOptions}
          onSelect={value => onSelectLocation(invite.id, value)}
        />

        <MemoInviteDropdownField
          label="링크 만료 기간"
          value={invite.expiry}
          placeholder="만료 기간 선택"
          options={expiryOptions}
          onSelect={value => onSelectExpiry(invite.id, value)}
        />

        <MemoAppButton
          label="링크 생성"
          variant="primary"
          textVariant="body6"
          disabled={!canGenerate}
          onPress={() => onGenerateLink(invite.id)}
        />
      </MemoBaseCard>

      {hasLink && (
        <View style={styles.linkContainer}>
          <MemoGeneratedLinkRow
            link={invite.generatedLink}
            onCopy={() => onCopy(invite.id)}
            onShare={() => onShare(invite.id)}
          />
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
