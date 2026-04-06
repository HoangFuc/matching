import { AppImages } from '@/src/constants/images';

export interface IFileTypeConfig {
  label: string;
  bgColor: string;
  image?: ReturnType<typeof require>;
}

const EXT_MAP: Record<string, IFileTypeConfig> = {
  // PDF
  pdf:  { label: 'PDF', bgColor: '#E74C3C', image: AppImages.filePdf },
  // Word
  doc:  { label: 'DOC', bgColor: '#2B579A', image: AppImages.fileDocs },
  docx: { label: 'DOC', bgColor: '#2B579A', image: AppImages.fileDocs },
  // Excel
  xls:  { label: 'XLS', bgColor: '#217346', image: AppImages.fileXlsx },
  xlsx: { label: 'XLS', bgColor: '#217346', image: AppImages.fileXlsx },
  csv:  { label: 'CSV', bgColor: '#217346', image: AppImages.fileXlsx },
  // PowerPoint
  ppt:  { label: 'PPT', bgColor: '#D04423', image: AppImages.filePptx },
  pptx: { label: 'PPT', bgColor: '#D04423', image: AppImages.filePptx },
  // Audio
  mp3:  { label: 'MP3', bgColor: '#16A085', image: AppImages.fileMp3 },
  m4a:  { label: 'M4A', bgColor: '#16A085', image: AppImages.fileMp3 },
  wav:  { label: 'WAV', bgColor: '#16A085', image: AppImages.fileMp3 },
  aac:  { label: 'AAC', bgColor: '#16A085', image: AppImages.fileMp3 },
  // Video
  mp4:  { label: 'MP4', bgColor: '#6C3483', image: AppImages.fileMp4 },
  mov:  { label: 'MOV', bgColor: '#6C3483', image: AppImages.fileMp4 },
  avi:  { label: 'AVI', bgColor: '#6C3483', image: AppImages.fileMp4 },
  mkv:  { label: 'MKV', bgColor: '#6C3483', image: AppImages.fileMp4 },
  // Archive
  zip:  { label: 'ZIP', bgColor: '#D4AC0D', image: AppImages.fileZip },
  rar:  { label: 'RAR', bgColor: '#D4AC0D', image: AppImages.fileZip },
  '7z': { label: '7Z',  bgColor: '#D4AC0D', image: AppImages.fileZip },
  // HWP
  hwp:  { label: 'HWP', bgColor: '#0E5EAE', image: AppImages.fileHwp },
  // Text
  txt:  { label: 'TXT', bgColor: '#7F8C8D' },
};

const FALLBACK: IFileTypeConfig = {
  label: 'FILE',
  bgColor: '#95A5A6',
  image: AppImages.fileUndefined,
};

export function getFileTypeConfig(fileName: string): IFileTypeConfig {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MAP[ext] ?? FALLBACK;
}

export function isImageFileName(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif'].includes(ext);
}
