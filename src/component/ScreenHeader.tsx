import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';
import { useNavigation } from '@react-navigation/native';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { ArrowLeft2 } from '../constants/icons';

interface IProps {
  title: string;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
  onPressBack?: () => void;
}

const ScreenHeader: React.FC<IProps> = ({
  title,
  rightElement,
  icon,
  onPressBack,
}) => {
  const navigation = useNavigation();

  //---------------------------------------
  const handlePressBack = React.useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onPressBack]);

  if (icon) {
    return (
      <View style={styles.iconContainer}>
        <Pressable
          hitSlop={8}
          onPress={handlePressBack}
          style={styles.iconBackButton}
        >
          <ArrowLeft2
            size={`${ms(24)}`}
            color={AppColors.white}
            variant="Linear"
          />
        </Pressable>
        {icon}

        <AppText variant="heading1" color={AppColors.white}>
          {title}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="heading3" color={AppColors.white} style={styles.title}>
        {title}
      </AppText>

      <Pressable hitSlop={8} onPress={handlePressBack} style={styles.left}>
        <ArrowLeft2
          size={`${ms(24)}`}
          color={AppColors.white}
          variant="Linear"
        />
      </Pressable>

      {rightElement ?? <View style={styles.placeholder} />}
    </View>
  );
};

export const MemoScreenHeader = React.memo(ScreenHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    backgroundColor: AppColors.purple,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: AppColors.purple,
    gap: ms(16),
    marginBottom: ms(24),
  },
  iconBackButton: {
    position: 'absolute',
    left: ms(16),
    top: ms(16),
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: ms(24),
    textAlign: 'center',
  },
  left: {
    zIndex: 1,
  },
  placeholder: {
    width: ms(24),
  },
});
