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
  companyName?: string;
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
  directorLabel,
  companyName,
  onSelectRole,
  onSelectLocation,
  onSelectExpiry,
  onGenerateLink,
  isGeneratingLink,
}) => {
  const canGenerate =
    invite.role !== '' &&
    invite.expiry !== '' &&
    (!!directorLabel || invite.location !== '');
  const hasLink = invite.generatedLink !== '';
  const isDirector = !!directorLabel;

  const snapshotRef = React.useRef<{
    role: string;
    location: string;
    expiry: string;
  } | null>(null);
  const [settingsChanged, setSettingsChanged] = React.useState(false);

  //---------------------------------------
  React.useEffect(() => {
    if (hasLink && snapshotRef.current) {
      const changed =
        invite.role !== snapshotRef.current.role ||
        invite.location !== snapshotRef.current.location ||
        invite.expiry !== snapshotRef.current.expiry;
      setSettingsChanged(changed);
    }
  }, [hasLink, invite.role, invite.location, invite.expiry]);

  //---------------------------------------
  React.useEffect(() => {
    if (hasLink) {
      snapshotRef.current = {
        role: invite.role,
        location: invite.location,
        expiry: invite.expiry,
      };
      setSettingsChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invite.generatedLink]);

  return (
    <View>
      <MemoBaseCard style={[styles.card, hasLink && styles.cardConnected]}>
        <View style={styles.row}>
          <View style={styles.rowItemLeft}>
            <MemoInviteDropdownField
              label="초대 대상 직책"
              value={invite.role}
              placeholder="직책 선택"
              options={roleOptions}
              onSelect={option => onSelectRole(invite.id, option)}
              useBottomSheet
            />
          </View>

          <View style={styles.rowItemRight}>
            {isDirector ? (
              <View style={[styles.directorRow]}>
                <AppText variant="body7" color={AppColors.gray90}>
                  소속 위치
                </AppText>

                <View style={styles.directorLabelRow}>
                  <AppText variant="body8" color={AppColors.gray90}>
                    {`${companyName ?? ''} 총괄 2`}
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
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowTwoItemLeft}>
            <MemoInviteDropdownField
              label="링크 만료 기간"
              value={invite.expiry}
              placeholder="만료 기간 선택"
              options={expiryOptions}
              onSelect={option => onSelectExpiry(invite.id, option)}
              useBottomSheet
            />
          </View>

          <View style={styles.rowTwoItemRight}>
            <MemoAppButton
              label="링크 생성"
              variant="primary"
              textVariant="body6"
              disabled={!canGenerate || (hasLink && !settingsChanged)}
              loading={isGeneratingLink}
              onPress={() => onGenerateLink(invite.id)}
              style={styles.generateButton}
            />
          </View>
        </View>
      </MemoBaseCard>

      {hasLink && (
        <MemoBaseCard style={styles.linkContainer}>
          <MemoGeneratedLinkRow
            link={invite.generatedLink}
            settingsChanged={settingsChanged}
          />
        </MemoBaseCard>
      )}
    </View>
  );
};

export const MemoInviteCard = React.memo(InviteCard);

const styles = StyleSheet.create({
  card: {
    gap: ms(12),
  },
  row: {
    flexDirection: 'row',
    gap: ms(12),
  },
  rowItemLeft: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rowItemRight: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  rowTwoItemLeft: {
    flex: 2.5,
    justifyContent: 'flex-end',
  },
  rowTwoItemRight: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  generateButton: {
    borderRadius: ms(8),
    paddingVertical: ms(8),
    paddingHorizontal: ms(12),
    gap: ms(10),
  },
  cardConnected: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  linkContainer: {
    borderBottomLeftRadius: ms(16),
    borderBottomRightRadius: ms(16),
    padding: ms(16),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
