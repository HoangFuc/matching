import { Platform, ViewStyle } from 'react-native';

export const CardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#5329C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  default: {
    elevation: 4,
  },
});
