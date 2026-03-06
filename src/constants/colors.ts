// Design system color palette

export const Grayscale = {
  gray100: '#161616',
  gray90: '#2B2B2B',
  gray80: '#434343',
  gray70: '#5B5B5B',
  gray60: '#737373',
  gray50: '#8B8B8B',
  gray40: '#BEBEBE',
  gray30: '#DBDBDB',
  gray20: '#F0F0F0',
  gray10: '#FAFAFA',
  white: '#FFFFFF',
} as const;

export const Primary = {
  purple: '#6B1FAD',
  negative: '#FF4848',
  green: '#45AD18',
  lavendar: '#F0EAFF',
  lightBlue: '#E0F1FF',
  strongBlue: '#0C77DB',
  pastelPink: '#FFEFEF',
  lightPink: '#FFEEEE',
} as const;

export const AppColors = {
  ...Grayscale,
  ...Primary,
} as const;

export type AppColor = (typeof AppColors)[keyof typeof AppColors];
