import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ExportCurve,
  InfoCircle,
  TickCircle
} from 'iconsax-react-nativejs';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppSafeAreaView } from '@/src/component/AppSafeAreaView';
import { AppText } from '@/src/component/AppText';
import { MemoBaseCard } from '@/src/component/BaseCard';
import { MemoBottomButtonGroup } from '@/src/component/BottomButtonGroup';
import { RHFFormInput } from '@/src/component/RHFFormInput';
import { MemoScreenBody } from '@/src/component/ScreenBody';
import { MemoScreenHeader } from '@/src/component/ScreenHeader';
import { MemoStepProgressBar } from '@/src/component/StepProgressBar';
import { AppColors } from '@/src/constants/colors';
import { AppImages } from '@/src/constants/images';
import type { AuthStackParamList } from '@/src/interface/tab.interface';
import { useRegisterCompany } from '../context/RegisterCompanyContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateAgency'>;

type ManagementType = 'single' | 'dual';

type FormValues = {
  agencyName: string;
};

const MANAGEMENT_OPTIONS: {
  key: ManagementType;
  title: string;
  description: string;
  image: ReturnType<typeof require>;
}[] = [
  {
    key: 'single',
    title: '총괄 1명',
    description: '한 명의 마스터가 전체 업무를 총괄 관리하는 방식입니다.',
    image: AppImages.addUser,
  },
  {
    key: 'dual',
    title: '총괄 2명 (경쟁)',
    description:
      '두 명의 총괄을 분담하여 경쟁적으로 성과를 관리하는 방식입니다.',
    image: AppImages.addGroup,
  },
];

const CreateAgencyScreen: React.FC<Props> = ({ navigation, route }) => {
  const fromSocialLogin = route.params?.fromSocialLogin;
  const { setStepData } = useRegisterCompany();

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      agencyName: '',
    },
  });

  const [managementType, setManagementType] =
    React.useState<ManagementType>('single');
  const [companyLogo, setCompanyLogo] = React.useState<
    { uri: string; type: string; name: string } | undefined
  >();

  const isSubmitEnabled =
    watch('agencyName').trim().length > 0 &&
    !!managementType 

  //---------------------------------------
  const handlePickImage = React.useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, maxWidth: 500, maxHeight: 500 },
      response => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (asset.type && !allowedTypes.includes(asset.type)) {
          Alert.alert('', 'PNG 또는 JPG 형식의 이미지만 업로드할 수 있습니다.');
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (asset.fileSize && asset.fileSize > maxSize) {
          Alert.alert('', '이미지 크기는 최대 5MB까지 업로드할 수 있습니다.');
          return;
        }

        setCompanyLogo({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'logo.jpg',
        });
      },
    );
  }, []);

  //---------------------------------------
  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  //---------------------------------------
  const onSubmit = React.useCallback(
    (data: FormValues) => {
      const stepData = {
        companyName: data.agencyName,
        directorCount: managementType === 'single' ? 1 : 2,
        companyLogo,
      };
      setStepData(stepData);
      navigation.navigate('OrgChartSetup', { managementType, fromSocialLogin });
    },
    [navigation, managementType, setStepData, companyLogo],
  );

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.purple} />

      <MemoScreenHeader title="대행사 만들기" />

      <MemoScreenBody>
        <View style={styles.stepBarContainer}>
          <MemoStepProgressBar currentStep={fromSocialLogin ? 1 : 2} totalSteps={fromSocialLogin ? 2 : 4} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 대행사명 */}
          <MemoBaseCard>
            <RHFFormInput
              control={control}
              name="agencyName"
              label="대행사명"
              placeholder="대행사명을 입력하세요"
              required
              gap={4}
            />

            <View style={styles.infoRow}>
              <InfoCircle
                size={`${ms(14)}`}
                color={AppColors.gray80}
                variant="Linear"
              />

              <AppText variant="detail" color={AppColors.gray80}>
                대행사명은 나중에 설정에서 변경할 수 있습니다.
              </AppText>
            </View>
          </MemoBaseCard>

          {/* 대행사 로고 */}
          <MemoBaseCard style={{ gap: ms(8) }}>
            <AppText variant="body6" color={AppColors.gray90}>
              대행사 로고 (선택)
            </AppText>

            <Pressable style={styles.uploadArea} onPress={handlePickImage}>
              {companyLogo ? (
                <Image
                  source={{ uri: companyLogo.uri }}
                  style={styles.logoPreview}
                />
              ) : (
                <>
                  <ExportCurve
                    size={`${ms(25)}`}
                    color={AppColors.gray40}
                    variant="Linear"
                  />

                  <AppText variant="body8" color={AppColors.gray40}>
                    이미지 업로드
                  </AppText>

                  <AppText variant="detail" color={AppColors.gray40}>
                    최대 5MB, PNG/JPG 추천 (500x500px)
                  </AppText>
                </>
              )}
            </Pressable>
          </MemoBaseCard>

          {/* 총괄 운영 방식 선택 */}
          <MemoBaseCard style={styles.managementSection}>
            <AppText variant="body6" color={AppColors.gray90}>
              총괄 운영 방식 선택
            </AppText>

            {MANAGEMENT_OPTIONS.map(option => {
              const isSelected = managementType === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setManagementType(option.key)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionIcon}>
                      <Image source={option.image} style={styles.optionImage} />
                    </View>

                    <View style={styles.optionTextGroup}>
                      <AppText variant="body2" color={AppColors.gray90}>
                        {option.title}
                      </AppText>

                      <AppText variant="body8" color={AppColors.gray90}>
                        {option.description}
                      </AppText>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <TickCircle
                        size={`${ms(24)}`}
                        color={AppColors.purple}
                        variant="Bulk"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </MemoBaseCard>
        </ScrollView>

        <MemoBottomButtonGroup>
          <MemoAppButton
            label="취소"
            variant="secondary"
            textVariant="body6"
            onPress={handleCancel}
          />

          <MemoAppButton
            label="다음"
            variant="primary"
            textVariant="body6"
            disabled={!isSubmitEnabled}
            onPress={handleSubmit(onSubmit)}
          />
        </MemoBottomButtonGroup>
      </MemoScreenBody>
    </AppSafeAreaView>
  );
};

export const MemoCreateAgencyScreen = React.memo(CreateAgencyScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.purple,
  },
  stepBarContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    marginBottom: ms(8),
  },
  scrollView: {
    flex: 1,
    marginBottom: ms(16),
  },
  scrollContent: {
    flexGrow: 1,
    padding: ms(16),
    gap: ms(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    marginTop: ms(4),
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(16),
    borderWidth: 1,
    borderColor: AppColors.gray30,
    borderStyle: 'dashed',
    borderRadius: ms(14),
    gap: ms(8),
    height: ms(155),
    overflow: 'hidden',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: ms(14),
  },
  managementSection: {
    gap: ms(8),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: AppColors.gray20,
    backgroundColor: AppColors.white,
  },
  optionCardSelected: {
    borderColor: AppColors.purple,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    flex: 1,
  },
  optionIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionImage: {
    width: ms(50),
    height: ms(50),
    resizeMode: 'contain',
  },
  optionTextGroup: {
    flex: 1,
    gap: ms(2),
  },
  checkIcon: {
    position: 'absolute',
    top: ms(8),
    right: ms(8),
  },
});
