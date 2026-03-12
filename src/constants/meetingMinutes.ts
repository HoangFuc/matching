import {
  TMeetingTypeKey,
  TMeetingTypeLabel,
} from '@/src/interface/meetingMinutes.interface';
import { AppColors } from './colors';

export const MEETING_TYPE_LABEL: Record<TMeetingTypeKey, TMeetingTypeLabel> = {
  offline: '오프라인',
  recording: '유선',
};

export const MEETING_TYPE_KEY: Record<TMeetingTypeLabel, TMeetingTypeKey> = {
  오프라인: 'offline',
  유선: 'recording',
};

export const MEETING_TYPE_CONFIG: Record<
  TMeetingTypeLabel,
  { bgColor: string; textColor: string }
> = {
  오프라인: {
    bgColor: AppColors.lightPink,
    textColor: AppColors.negative,
  },
  유선: {
    bgColor: AppColors.lightCream,
    textColor: AppColors.amber,
  },
};

export const MEETING_BADGE_CONFIG = {
  녹취미팅: {
    bgColor: AppColors.lightGreen,
    textColor: AppColors.green,
  },
} as const;
