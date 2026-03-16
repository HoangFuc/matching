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
  onPressBack?: () => void;
}

const ScreenHeader: React.FC<IProps> = ({ title, rightElement, onPressBack }) => {
  const navigation = useNavigation();

  const handlePressBack = React.useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onPressBack]);

  return (
    <View style={styles.container}>
      <AppText
        variant="heading3"
        color={AppColors.white}
        style={styles.title}
      >
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
    paddingBottom: ms(24),
    backgroundColor: AppColors.purple,
    height: ms(49),
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
