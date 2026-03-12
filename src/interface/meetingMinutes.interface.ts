export type TMeetingTypeKey = 'offline' | 'recording';
export type TMeetingTypeLabel = '오프라인' | '유선';

export type TMeetingMinutesCreator = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type TRecording = {
  id: string;
  meetingLogId: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  durationSeconds: number | null;
  mimeType: string;
  createdAt: string;
  playUrl: string;
};

export type TMeetingMinutes = {
  id: string;
  meetingScheduleId: string | null;
  companyId: string;
  createdBy: string;
  meetingType: TMeetingTypeKey;
  meetingDate: string;
  customerName: string;
  customerPhone: string;
  address: string;
  consultationContent: string;
  createdAt: string;
  updatedAt: string;
  creator: TMeetingMinutesCreator;
  meetingSchedule: null;
  recordings?: TRecording[];
  hasRecording?: boolean;
};

export interface IMeetingLogListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  meetingType?: string;
}

export interface IMeetingLogListResponse {
  data: TMeetingMinutes[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type TUploadFileStatus = 'uploading' | 'done' | 'error';

export type TUploadFile = {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: TUploadFileStatus;
  uri?: string;
  type?: string;
};

export interface ICreateMeetingLogPayload {
  meetingType: TMeetingTypeKey;
  meetingDate: string;
  customerName: string;
  customerPhone: string;
  address: string;
  consultationContent: string;
}

export interface ICreateMeetingLogResponse {
  id: string;
  uploadId: string;
}

export interface IUpdateMeetingLogPayload {
  id: string;
  meetingType: TMeetingTypeKey;
  meetingDate: string;
  customerName: string;
  customerPhone: string;
  address: string;
  consultationContent: string;
}

export interface IDeleteRecordingResponse {
  uploadId: string;
}
