import {fetchLocation} from '@/src/services/locationService';

jest.mock('@env', () => ({API_BASE_URL: 'https://api.test.com'}));

const mockGetCurrentPosition = jest.fn();
jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: (...args: any[]) => mockGetCurrentPosition(...args),
}));

describe('locationService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockGetCurrentPosition.mockReset();
  });

  //---------------------------------------
  it('returns location data with reverse geocoded address', async () => {
    mockGetCurrentPosition.mockImplementation((onSuccess) => {
      onSuccess({coords: {latitude: 37.5665, longitude: 126.978}});
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        address: {
          city: '서울특별시',
          country: '대한민국',
        },
      }),
    );

    const result = await fetchLocation();

    expect(result).toEqual({
      latitude: 37.5665,
      longitude: 126.978,
      loginLocation: '서울특별시, 대한민국',
    });
  });

  //---------------------------------------
  it('returns empty loginLocation when reverse geocode has no city', async () => {
    mockGetCurrentPosition.mockImplementation((onSuccess) => {
      onSuccess({coords: {latitude: 0, longitude: 0}});
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        address: {
          country: '대한민국',
        },
      }),
    );

    const result = await fetchLocation();

    expect(result?.loginLocation).toBe('대한민국');
  });

  //---------------------------------------
  it('returns empty loginLocation when reverse geocode fails', async () => {
    mockGetCurrentPosition.mockImplementation((onSuccess) => {
      onSuccess({coords: {latitude: 37.5, longitude: 127.0}});
    });

    fetchMock.mockRejectOnce(new Error('Network error'));

    const result = await fetchLocation();

    expect(result).toEqual({
      latitude: 37.5,
      longitude: 127.0,
      loginLocation: '',
    });
  });

  //---------------------------------------
  it('returns null when geolocation fails', async () => {
    mockGetCurrentPosition.mockImplementation((_onSuccess: any, onError: any) => {
      onError(new Error('Location denied'));
    });

    const result = await fetchLocation();

    expect(result).toBeNull();
  });

  //---------------------------------------
  it('uses town/village/county as fallback city name', async () => {
    mockGetCurrentPosition.mockImplementation((onSuccess) => {
      onSuccess({coords: {latitude: 35.0, longitude: 128.0}});
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        address: {
          village: '마을',
          country: '대한민국',
        },
      }),
    );

    const result = await fetchLocation();

    expect(result?.loginLocation).toBe('마을, 대한민국');
  });

  //---------------------------------------
  it('returns empty string when address is null', async () => {
    mockGetCurrentPosition.mockImplementation((onSuccess) => {
      onSuccess({coords: {latitude: 37.0, longitude: 127.0}});
    });

    fetchMock.mockResponseOnce(JSON.stringify({}));

    const result = await fetchLocation();

    expect(result?.loginLocation).toBe('');
  });
});
