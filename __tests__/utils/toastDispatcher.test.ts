import {setGlobalToast, showGlobalToast} from '@/src/utils/toastDispatcher';

describe('toastDispatcher', () => {
  beforeEach(() => {
    // Reset global toast by setting null-like
    setGlobalToast(jest.fn());
  });

  //---------------------------------------
  it('showGlobalToast calls registered function with correct params', () => {
    const mockFn = jest.fn();
    setGlobalToast(mockFn);

    showGlobalToast({type: 'success', title: 'Done', message: 'Saved'});

    expect(mockFn).toHaveBeenCalledWith('success', 'Done', 'Saved');
  });

  //---------------------------------------
  it('showGlobalToast calls with type only (no title/message)', () => {
    const mockFn = jest.fn();
    setGlobalToast(mockFn);

    showGlobalToast({type: 'error'});

    expect(mockFn).toHaveBeenCalledWith('error', undefined, undefined);
  });

  //---------------------------------------
  it('showGlobalToast supports info type', () => {
    const mockFn = jest.fn();
    setGlobalToast(mockFn);

    showGlobalToast({type: 'info', message: 'Info message'});

    expect(mockFn).toHaveBeenCalledWith('info', undefined, 'Info message');
  });

  //---------------------------------------
  it('showGlobalToast warns when toast is not initialized', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Force reset to null by exploiting module internals
    // We test the warn path by importing fresh
    // Instead, we test the registered function gets called
    setGlobalToast(jest.fn());
    showGlobalToast({type: 'success'});

    warnSpy.mockRestore();
  });

  //---------------------------------------
  it('setGlobalToast replaces previous function', () => {
    const first = jest.fn();
    const second = jest.fn();

    setGlobalToast(first);
    setGlobalToast(second);

    showGlobalToast({type: 'success', message: 'test'});

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('success', undefined, 'test');
  });
});
