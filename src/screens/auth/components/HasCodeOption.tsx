import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { AppColors } from '@/src/constants/colors';
import { InfoCircle, LoginCurve, TickCircle } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { useLazyGetInvitationByCodeQuery } from '@/src/store/api/auth.api';

type Props = {
  isSelected: boolean;
  onSelect: () => void;
};

type FormValues = {
  inviteCode: string;
};

const extractCode = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.includes('/')) {
    return trimmed.substring(trimmed.lastIndexOf('/') + 1);
  }
  return trimmed;
};

//---------------------------------------
const HasCodeOption: React.FC<Props> = ({ isSelected, onSelect }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { control, watch } = useForm<FormValues>({
    defaultValues: { inviteCode: '' },
  });
  const [getInvitation, { isLoading }] = useLazyGetInvitationByCodeQuery();

  const inviteCode = watch('inviteCode');

  //---------------------------------------
  const handleConnect = React.useCallback(async () => {
    const code = extractCode(inviteCode);
    if (!code) {
      return;
    }

    try {
      const invitation = await getInvitation(code).unwrap();
      navigation.navigate('ConfirmOrganizationInvitation', { invitation });
    } catch (error) {
      console.error('Failed to fetch invitation:', error);
    }
  }, [inviteCode, getInvitation, navigation]);

  return (
    <View style={styles.hasCodeWrapper}>
      <TouchableOpacity
        style={[styles.hasCodeTop, isSelected && styles.hasCodeTopSelected]}
        onPress={onSelect}
      >
        <Image
          source={AppImages.link}
          style={{ width: ms(50), height: ms(50) }}
          resizeMode="contain"
        />

        <View style={styles.optionTextContainer}>
          <AppText variant="body2" color={AppColors.gray90}>
            초대 코드가 있어요
          </AppText>

          <AppText
            variant="body8"
            color={AppColors.gray90}
            style={styles.optionDescription}
          >
            전달받은 초대 코드를 입력하여 기존 조직에 바로 참여합니다.
          </AppText>
        </View>

        {isSelected && (
          <TickCircle
            size={ms(24)}
            color={AppColors.purple}
            variant="Bulk"
            style={styles.tickIcon}
          />
        )}
      </TouchableOpacity>

      {/* Invite code input */}
      {isSelected && (
        <View style={styles.inviteCodeSection}>
          <View style={styles.inviteCodeInputRow}>
            <View style={styles.inviteCodeInputWrapper}>
              <RHFFormInput
                control={control}
                name="inviteCode"
                label="초대 코드 입력"
                placeholder="초대 코드 입력"
              />
            </View>

            <MemoAppButton
              label="접속"
              iconPosition="right"
              icon={
                <LoginCurve
                  size={ms(16)}
                  color={AppColors.purple}
                  variant="Linear"
                />
              }
              textVariant="body6"
              style={styles.connectButton}
              onPress={handleConnect}
              disabled={!inviteCode || isLoading}
              loading={isLoading}
            />
          </View>

          <View style={styles.inviteCodeHint}>
            <InfoCircle
              size={ms(16)}
              color={AppColors.gray80}
              variant="Linear"
            />

            <AppText
              variant="detail"
              color={AppColors.gray80}
              style={styles.inviteCodeHintText}
            >
              전달받은 초대 링크를 다시 눌러 앱을 열면 별도의 입력 없이 자동으로
              인식되어 편리합니다.
            </AppText>
          </View>
        </View>
      )}
    </View>
  );
};

export const MemoHasCodeOption = React.memo(HasCodeOption);

const styles = StyleSheet.create({
  hasCodeWrapper: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    overflow: 'hidden',
    gap: ms(16),
  },
  hasCodeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    gap: ms(16),
  },
  hasCodeTopSelected: {
    borderWidth: 1,
    borderColor: AppColors.purple,
    borderRadius: ms(14),
  },
  optionTextContainer: {
    flex: 1,
    gap: ms(4),
  },
  optionDescription: {
    lineHeight: ms(18),
  },
  tickIcon: {
    position: 'absolute',
    top: ms(10),
    right: ms(10),
  },
  inviteCodeSection: {
    padding: ms(16),
    paddingTop: 0,
    gap: ms(4),
    backgroundColor: AppColors.white,
    borderColor: AppColors.gray30,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: ms(14),
    borderBottomLeftRadius: ms(14),
  },
  inviteCodeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(8),
  },
  inviteCodeInputWrapper: {
    flex: 1,
  },
  connectButton: {
    paddingHorizontal: ms(16),
    height: ms(36),
    flexDirection: 'row',
    gap: ms(4),
    borderRadius: ms(8),
    backgroundColor: AppColors.pastelLavendar,
  },
  inviteCodeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(4),
  },
  inviteCodeHintText: {
    flex: 1,
    lineHeight: ms(16),
  },
});
