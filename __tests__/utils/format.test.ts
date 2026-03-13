import {formatFileSize} from '@/src/utils/format';

describe('formatFileSize', () => {
  it('returns bytes for values under 1KB', () => {
    expect(formatFileSize(0)).toBe('0B');
    expect(formatFileSize(512)).toBe('512B');
    expect(formatFileSize(1023)).toBe('1023B');
  });

  it('returns KB for values under 1MB', () => {
    expect(formatFileSize(1024)).toBe('1.0KB');
    expect(formatFileSize(1536)).toBe('1.5KB');
    expect(formatFileSize(1024 * 500)).toBe('500.0KB');
  });

  it('returns MB for values 1MB and above', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0MB');
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5MB');
    expect(formatFileSize(1024 * 1024 * 100)).toBe('100.0MB');
  });
});
