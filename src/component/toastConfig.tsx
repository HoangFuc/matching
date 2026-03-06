import React from 'react';
import { StyleSheet, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';
import { BaseToastProps } from 'react-native-toast-message';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { CloseCircle, TickCircle } from '../constants/icons';

const SuccessToast: React.FC<BaseToastProps> = ({ text1 }) => (
  <View style={[styles.container, styles.successBorder]}>
    <TickCircle size={ms(20)} color={AppColors.green} variant="Bold" />

    <AppText variant="body6" color={AppColors.green}>
      {text1}
    </AppText>
  </View>
);

const ErrorToast: React.FC<BaseToastProps> = ({ text1 }) => (
  <View style={[styles.container, styles.errorBorder]}>
    <CloseCircle size={ms(20)} color={AppColors.negative} variant="Bold" />

    <AppText variant="body6" color={AppColors.negative}>
      {text1}
    </AppText>
  </View>
);

export const toastConfig = {
  success: (props: BaseToastProps) => <SuccessToast {...props} />,
  error: (props: BaseToastProps) => <ErrorToast {...props} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderRadius: ms(12),
    borderWidth: 1,
    backgroundColor: AppColors.white,
  },
  successBorder: {
    borderColor: AppColors.green,
  },
  errorBorder: {
    borderColor: AppColors.negative,
  },
});
