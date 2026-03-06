import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  TickCircle,
  CloseCircle,
  InfoCircle,
} from '@/src/constants/icons';
import {ms} from 'react-native-size-matters/extend';

import {AppColors} from '@/src/constants/colors';
import {AppText} from './AppText';

export type TAlertType = 'success' | 'error' | 'info';

interface IProps {
  type: TAlertType;
  title?: string;
  message?: string;
}

const ALERT_CONFIG: Record<TAlertType, {color: string}> = {
  success: {color: AppColors.green},
  error: {color: AppColors.negative},
  info: {color: AppColors.strongBlue},
};

const AlertIcon: React.FC<{type: TAlertType; color: string}> = ({
  type,
  color,
}) => {
  const size = `${ms(18)}`;
  switch (type) {
    case 'success':
      return <TickCircle size={size} color={color} variant="Bold" />;
    case 'error':
      return <CloseCircle size={size} color={color} variant="Bold" />;
    case 'info':
      return <InfoCircle size={size} color={color} variant="Bold" />;
  }
};

const AppAlert: React.FC<IProps> = ({type, title, message}) => {
  const {color} = ALERT_CONFIG[type];

  return (
    <View style={[styles.container, {borderColor: color}]}>
      <View style={styles.row}>
        <AlertIcon type={type} color={color} />
        <View style={styles.textContainer}>
          {title && (
            <AppText variant="body6" color={color}>
              {title}
            </AppText>
          )}
          {message && (
            <AppText variant="detail" color={color}>
              {message}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(AppAlert);

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(8),
    backgroundColor: AppColors.white,
    paddingVertical: ms(10),
    paddingHorizontal: ms(16),
    borderLeftWidth: 3,
    shadowColor: '#171A1F',
    shadowOffset: {width: 1, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
    marginHorizontal: ms(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: ms(8),
    gap: ms(2),
    flex: 1,
  },
});
