import { TextStyle } from 'react-native';

// Font weight mapping
export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

// Line height multiplier: 140%
const lh = (size: number) => Math.round(size * 1.4);

// Letter spacing: 0.2% of font size
const ls = (size: number) => size * 0.002;

export const Typography = {
  heading1: {
    fontSize: 24,
    fontWeight: FontWeight.semibold,
    lineHeight: lh(24),
    letterSpacing: ls(24),
  },
  heading2: {
    fontSize: 20,
    fontWeight: FontWeight.semibold,
    lineHeight: lh(20),
    letterSpacing: ls(20),
  },
  heading3: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    lineHeight: lh(18),
    letterSpacing: ls(18),
  },
  body1: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    lineHeight: lh(16),
    letterSpacing: ls(16),
  },
  body2: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    lineHeight: lh(16),
    letterSpacing: ls(16),
  },
  body3: {
    fontSize: 16,
    fontWeight: FontWeight.medium,
    lineHeight: lh(16),
    letterSpacing: ls(16),
  },
  body4: {
    fontSize: 16,
    fontWeight: FontWeight.regular,
    lineHeight: lh(16),
    letterSpacing: ls(16),
  },
  body5: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    lineHeight: lh(14),
    letterSpacing: ls(14),
  },
  body6: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    lineHeight: lh(14),
    letterSpacing: ls(14),
  },
  body7: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    lineHeight: lh(14),
    letterSpacing: ls(14),
  },
  body8: {
    fontSize: 14,
    fontWeight: FontWeight.regular,
    lineHeight: lh(14),
    letterSpacing: ls(14),
  },
  detail: {
    fontSize: 12,
    fontWeight: FontWeight.regular,
    lineHeight: lh(12),
    letterSpacing: ls(12),
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;
