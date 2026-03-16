/**
 * Fix UTF-8 text that was incorrectly decoded as Latin-1/ISO-8859-1.
 * e.g. "ë\x85¹ì\x9D\x8C" → "녹음"
 */
export const fixBrokenUtf8Encoding = (str: string): string => {
  try {
    const isLatin1Range = [...str].every(c => c.charCodeAt(0) < 256);
    if (!isLatin1Range) {
      return str;
    }

    return decodeURIComponent(
      [...str]
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  } catch {
    return str;
  }
};
