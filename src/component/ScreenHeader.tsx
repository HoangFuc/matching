import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { moderateScale as ms } from 'react-native-size-matters/extend';
import { useNavigation } from '@react-navigation/native';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';

interface IProps {
  title: string;
  rightElement?: React.ReactNode;
}

const ScreenHeader: React.FC<IProps> = ({ title, rightElement }) => {
  const navigation = useNavigation();

  const handlePressBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={8} onPress={handlePressBack}>
        <ArrowLeft2
          size={`${ms(24)}`}
          color={AppColors.white}
          variant="Linear"
        />
      </Pressable>

      <AppText variant="heading3" color={AppColors.white}>
        {title}
      </AppText>

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
  placeholder: {
    width: ms(24),
  },
});
