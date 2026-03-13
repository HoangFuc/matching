import {formatTimeAgo} from '@/src/utils/date';

describe('formatTimeAgo', () => {
  const now = Date.now();

  it('returns "방금 전" for less than 60 seconds ago', () => {
    const date = new Date(now - 30 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('방금 전');
  });

  it('returns minutes for less than 60 minutes ago', () => {
    const date = new Date(now - 5 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('5분 전');
  });

  it('returns hours for less than 24 hours ago', () => {
    const date = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('3시간 전');
  });

  it('returns days for less than 30 days ago', () => {
    const date = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('7일 전');
  });

  it('returns months for less than 12 months ago', () => {
    const date = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('2개월 전');
  });

  it('returns years for 12+ months ago', () => {
    const date = new Date(now - 400 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(date)).toBe('1년 전');
  });
});
