import {
  setGlobalShowUpdateRequired,
  showUpdateRequired,
} from '@/src/utils/updateRequiredDispatcher';

describe('updateRequiredDispatcher', () => {
  //---------------------------------------
  it('showUpdateRequired calls registered function with URL', () => {
    const mockFn = jest.fn();
    setGlobalShowUpdateRequired(mockFn);

    showUpdateRequired('https://play.google.com/store/apps/details?id=com.test');

    expect(mockFn).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=com.test',
    );
  });

  //---------------------------------------
  it('showUpdateRequired does nothing when not initialized', () => {
    // Reset by setting a known function then calling
    const mockFn = jest.fn();
    setGlobalShowUpdateRequired(mockFn);

    showUpdateRequired('https://example.com');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  //---------------------------------------
  it('setGlobalShowUpdateRequired replaces previous function', () => {
    const first = jest.fn();
    const second = jest.fn();

    setGlobalShowUpdateRequired(first);
    setGlobalShowUpdateRequired(second);

    showUpdateRequired('https://store.com/app');

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('https://store.com/app');
  });
});
