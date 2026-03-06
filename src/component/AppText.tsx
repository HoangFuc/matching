import React from 'react';
import { Text, TextProps } from 'react-native';

import { AppColor } from '../constants/colors';
import { Typography, TypographyVariant } from '../constants/typography';

type TAppTextProps = TextProps & {
  variant: TypographyVariant;
  color: AppColor | string;
};

export const AppText: React.FC<TAppTextProps> = props => {
  const { variant, color, style, ...rest } = props;

  return <Text style={[Typography[variant], { color }, style]} {...rest} />;
};
