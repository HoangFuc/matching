import { apiPost } from './api';

export const getSeed = async (): Promise<{ accessToken: string }> => {
  try {
    const response = await apiPost('dev/seed', {
      method: 'POST',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching seed data:', error);
    throw error;
  }
};
