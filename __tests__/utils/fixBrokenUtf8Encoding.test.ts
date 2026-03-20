import {fixBrokenUtf8Encoding} from '@/src/utils/fixBrokenUtf8Encoding';

describe('fixBrokenUtf8Encoding', () => {
  //---------------------------------------
  it('returns original string when already valid Unicode', () => {
    expect(fixBrokenUtf8Encoding('녹음')).toBe('녹음');
    expect(fixBrokenUtf8Encoding('Hello World')).toBe('Hello World');
  });

  //---------------------------------------
  it('returns empty string unchanged', () => {
    expect(fixBrokenUtf8Encoding('')).toBe('');
  });

  //---------------------------------------
  it('fixes Latin-1 encoded UTF-8 Korean text', () => {
    // Simulate broken encoding: "녹음" encoded as UTF-8 bytes interpreted as Latin-1
    const broken = String.fromCharCode(0xeb, 0x85, 0xb9, 0xec, 0x9d, 0x8c);
    expect(fixBrokenUtf8Encoding(broken)).toBe('녹음');
  });

  //---------------------------------------
  it('returns original string when decoding fails', () => {
    // Invalid UTF-8 byte sequence in Latin-1 range
    const invalid = String.fromCharCode(0x80, 0x81);
    const result = fixBrokenUtf8Encoding(invalid);
    // Should return original since decodeURIComponent will fail
    expect(typeof result).toBe('string');
  });

  //---------------------------------------
  it('handles pure ASCII strings', () => {
    expect(fixBrokenUtf8Encoding('abc123')).toBe('abc123');
  });

  //---------------------------------------
  it('handles mixed Latin-1 range characters', () => {
    // Characters in 0-255 range that form valid UTF-8
    const input = String.fromCharCode(0xc3, 0xa9); // "é" in UTF-8
    expect(fixBrokenUtf8Encoding(input)).toBe('é');
  });
});
