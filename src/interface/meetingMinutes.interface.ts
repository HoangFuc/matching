export type TMeetingType = '오프라인' | '유선';

export type TMeetingMinutes = {
  id: string;
  type: TMeetingType;
  isRecorded: boolean;
  title: string;
  customerName: string;
  date: string;
  content: string;
  recordingFile?: {
    name: string;
    size: string;
    duration: string;
  };
};

export type TUploadFileStatus = 'uploading' | 'done' | 'error';

export type TUploadFile = {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: TUploadFileStatus;
};
