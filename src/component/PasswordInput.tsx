import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-nativejs';
import { ms } from 'react-native-size-matters/extend';

import { AppColors } from '../constants/colors';
import { FontWeight } from '../constants/typography';
import { AppText } from './AppText';

interface IPasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
}

const PasswordInput: React.FC<IPasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  required,
  error,
}) => {
  const [visible, setVisible] = React.useState(false);

  //---------------------------------------
  const toggleVisibility = React.useCallback(() => {
    setVisible(prev => !prev);
  }, []);

  return (
    <View style={styles.inputGroup}>
      <AppText variant="body7" color={AppColors.gray90}>
        {label}{' '}
        {required && (
          <AppText variant="body7" color={AppColors.negative}>
            *
          </AppText>
        )}
      </AppText>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AppColors.gray40}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
        />

        <TouchableOpacity onPress={toggleVisibility} style={styles.eyeIcon}>
          {visible ? (
            <Eye size={ms(16)} color={AppColors.gray50} variant="Linear" />
          ) : (
            <EyeSlash size={ms(16)} color={AppColors.gray50} variant="Linear" />
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <AppText variant="detail" color={AppColors.negative}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

export const MemoPasswordInput = React.memo(PasswordInput);

const styles = StyleSheet.create({
  inputGroup: {
    gap: ms(4),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(8),
    backgroundColor: AppColors.gray10,
  },
  input: {
    flex: 1,
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    fontSize: 14,
    fontWeight: FontWeight.regular,
    color: AppColors.gray100,
    ...Platform.select({
      ios: {},
      default: { paddingVertical: ms(8) },
    }),
  },
  eyeIcon: {
    paddingHorizontal: ms(12),
  },
});
