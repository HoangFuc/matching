import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ms } from 'react-native-size-matters/extend';

import { MemoAppButton } from '@/src/component/AppButton';
import { AppText } from '@/src/component/AppText';
import { MemoUnderDevelopmentModal } from '@/src/component/UnderDevelopmentModal';
import { AppColors } from '@/src/constants/colors';
import { TickCircle } from '@/src/constants/icons';
import { AppImages } from '@/src/constants/images';
import type { AuthStackParamList } from '@/src/interface/tab.interface';

type Props = {
  isSelected: boolean;
  onSelect: () => void;
  fromSocialLogin?: boolean;
};

const NoCodeOption: React.FC<Props> = ({ isSelected, onSelect, fromSocialLogin }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [showModal, setShowModal] = useState(false);

  //---------------------------------------
  const handleJoin = React.useCallback(() => {
    if (fromSocialLogin) {
      setShowModal(true);
    } else {
      navigation.navigate('JoinMembership', { withSteps: true });
    }
  }, [navigation, fromSocialLogin]);

  return (
    <>
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={onSelect}
      >
        <Image
          source={AppImages.unlink}
          style={{ width: ms(50), height: ms(50) }}
          resizeMode="contain"
        />

        <View style={styles.optionTextContainer}>
          <AppText variant="body2" color={AppColors.gray90}>
            초대 코드가 없어요
          </AppText>
          <AppText
            variant="body8"
            color={AppColors.gray90}
            style={styles.optionDescription}
          >
            새로운 대화시를 직접 만들고 팀원을 초대할 수 있습니다.
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

      <View style={styles.joinButtonContainer}>
        <MemoAppButton
          label="조직 참여하기"
          variant="primary"
          textVariant="body6"
          style={styles.joinButton}
          disabled={!isSelected}
          onPress={handleJoin}
        />
      </View>

      <MemoUnderDevelopmentModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export const MemoNoCodeOption = React.memo(NoCodeOption);

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: AppColors.gray20,
    gap: ms(16),
  },
  optionCardSelected: {
    borderColor: AppColors.purple,
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
  joinButtonContainer: {
    alignItems: 'center',
  },
  joinButton: {
    width: ms(163),
    backgroundColor: AppColors.lavendar,
  },
});
