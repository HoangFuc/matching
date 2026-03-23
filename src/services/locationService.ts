import Geolocation from 'react-native-geolocation-service';

export interface ILocationData {
  latitude: number;
  longitude: number;
  loginLocation: string;
}

//---------------------------------------
const reverseGeocode = async (
  lat: number,
  lon: number,
): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ko`,
      { headers: { 'User-Agent': 'MatchingApp/1.0' } },
    );
    const data = await res.json();
    const addr = data?.address;
    if (addr) {
      const city =
        addr.city || addr.town || addr.village || addr.county || '';
      const country = addr.country || '';
      return city && country ? `${city}, ${country}` : country || '';
    }
    return '';
  } catch {
    return '';
  }
};

//---------------------------------------
export const fetchLocation = (): Promise<ILocationData | null> => {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const loginLocation = await reverseGeocode(latitude, longitude);
        resolve({ latitude, longitude, loginLocation });
      },
      () => {
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};
