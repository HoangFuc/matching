import { AppColors } from './colors';

export const MEETING_TYPE_CONFIG = {
  오프라인: {
    bgColor: AppColors.lightPink,
    textColor: AppColors.negative,
  },
  유선: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
  },
} as const;

export const MEETING_BADGE_CONFIG = {
  녹취미팅: {
    bgColor: AppColors.lightGreen,
    textColor: AppColors.green,
  },
} as const;
