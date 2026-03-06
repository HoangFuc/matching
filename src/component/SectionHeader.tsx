import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { AppColors } from '../constants/colors';
import { ArrowRight2 } from '../constants/icons';

interface IProps {
  title: string;
  onAction?: () => void;
  rightElement?: React.ReactNode;
}

const SectionHeader: React.FC<IProps> = ({ title, onAction, rightElement }) => {
  return (
    <View style={styles.container}>
      <AppText variant="body1" color={AppColors.gray90}>
        {title}
      </AppText>

      {rightElement}

      {!rightElement && onAction && (
        <TouchableOpacity hitSlop={8} onPress={onAction}>
          <ArrowRight2 size={`${ms(16)}`} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const MemoSectionHeader = React.memo(SectionHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
});
