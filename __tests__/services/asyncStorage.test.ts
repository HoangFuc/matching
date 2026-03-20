import {
  _storeData,
  _retrieveData,
  _removeData,
} from '@/src/api/async.storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('async.storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //---------------------------------------
  describe('_storeData', () => {
    it('stores data and returns true on success', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await _storeData('key', 'value');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');
      expect(result).toBe(true);
    });

    it('returns false on error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage full'));

      const result = await _storeData('key', 'value');

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  //---------------------------------------
  describe('_retrieveData', () => {
    it('retrieves stored value', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('stored-value');

      const result = await _retrieveData('key');

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('key');
      expect(result).toBe('stored-value');
    });

    it('returns null when key not found', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await _retrieveData('missing-key');

      expect(result).toBeNull();
    });

    it('returns null on error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Read error'));

      const result = await _retrieveData('key');

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  //---------------------------------------
  describe('_removeData', () => {
    it('removes data and returns true on success', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      const result = await _removeData('key');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('key');
      expect(result).toBe(true);
    });

    it('returns false on error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Remove error'));

      const result = await _removeData('key');

      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
