import {prepareUploadData, fetchUpload, uploadFile} from '@/src/services/uploadService';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));

const mockReadFile = jest.fn();
const mockWrap = jest.fn();
const mockFetch = jest.fn();

jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      readFile: (...args: any[]) => mockReadFile(...args),
    },
    wrap: (...args: any[]) => mockWrap(...args),
    fetch: (...args: any[]) => mockFetch(...args),
  },
}));

jest.mock('@/src/services/apiHeaderService', () => ({
  getCommonHeaders: jest.fn().mockResolvedValue({
    'Content-Type': 'application/json',
    Authorization: 'Bearer test-token',
    'X-App-Version': '0.0.1',
    'X-App-Platform': 'android',
  }),
}));

describe('uploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //---------------------------------------
  describe('prepareUploadData', () => {
    const file = {uri: 'file:///path/to/image.jpg', name: 'image.jpg', type: 'image/jpeg'};

    //---------------------------------------
    it('prepares base64 upload data', async () => {
      mockReadFile.mockResolvedValue('base64-encoded-data');

      const result = await prepareUploadData(file, 'base64');

      expect(mockReadFile).toHaveBeenCalledWith('/path/to/image.jpg', 'base64');
      expect(result).toEqual([
        {
          name: 'file',
          filename: 'image.jpg',
          type: 'image/jpeg',
          data: 'base64-encoded-data',
        },
      ]);
    });

    //---------------------------------------
    it('prepares stream upload data', async () => {
      mockWrap.mockReturnValue('wrapped-path');

      const result = await prepareUploadData(file, 'stream');

      expect(mockWrap).toHaveBeenCalledWith('/path/to/image.jpg');
      expect(result).toEqual([
        {
          name: 'file',
          filename: 'image.jpg',
          type: 'image/jpeg',
          data: 'wrapped-path',
        },
      ]);
    });

    //---------------------------------------
    it('strips file:// prefix from uri', async () => {
      mockWrap.mockReturnValue('wrapped');

      await prepareUploadData(
        {uri: 'file:///storage/emulated/0/file.pdf', name: 'file.pdf', type: 'application/pdf'},
        'stream',
      );

      expect(mockWrap).toHaveBeenCalledWith('/storage/emulated/0/file.pdf');
    });

    //---------------------------------------
    it('uses fallback name and type when not provided', async () => {
      mockWrap.mockReturnValue('wrapped');

      const result = await prepareUploadData(
        {uri: 'file:///path/to/data', name: '', type: ''},
        'stream',
      );

      expect(result[0].filename).toBe('file');
      expect(result[0].type).toBe('application/octet-stream');
    });

    //---------------------------------------
    it('appends extra fields', async () => {
      mockWrap.mockReturnValue('wrapped');

      const result = await prepareUploadData(file, 'stream', {
        folderId: 'folder-123',
        description: 'test file',
      });

      expect(result).toHaveLength(3);
      expect(result[1]).toEqual({name: 'folderId', data: 'folder-123'});
      expect(result[2]).toEqual({name: 'description', data: 'test file'});
    });
  });

  //---------------------------------------
  describe('fetchUpload', () => {
    it('sends multipart POST to correct URL with common headers', async () => {
      const mockResponse = {status: 200, data: 'ok'};
      mockFetch.mockResolvedValue(mockResponse);

      const uploadData = [
        {name: 'file', filename: 'doc.pdf', type: 'application/pdf', data: 'base64data'},
      ];

      const result = await fetchUpload('meeting-logs/uploads/abc123', uploadData);

      expect(mockFetch).toHaveBeenCalledWith(
        'POST',
        expect.stringContaining('/meeting-logs/uploads/abc123'),
        expect.objectContaining({
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer test-token',
        }),
        uploadData,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  //---------------------------------------
  describe('uploadFile', () => {
    it('prepares data and uploads in one call (stream mode by default)', async () => {
      mockWrap.mockReturnValue('wrapped-path');
      mockFetch.mockResolvedValue({status: 200});

      const file = {uri: 'file:///path/to/file.txt', name: 'file.txt', type: 'text/plain'};
      await uploadFile('data-room/uploads/xyz', file);

      expect(mockWrap).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        'POST',
        expect.stringContaining('/data-room/uploads/xyz'),
        expect.any(Object),
        expect.any(Array),
      );
    });

    //---------------------------------------
    it('uses base64 mode when specified', async () => {
      mockReadFile.mockResolvedValue('b64data');
      mockFetch.mockResolvedValue({status: 200});

      const file = {uri: 'file:///path/to/audio.m4a', name: 'audio.m4a', type: 'audio/m4a'};
      await uploadFile('meeting-logs/uploads/id1', file, 'base64');

      expect(mockReadFile).toHaveBeenCalledWith('/path/to/audio.m4a', 'base64');
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
