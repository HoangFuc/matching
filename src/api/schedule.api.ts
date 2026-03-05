import { apiPost } from './api';

export const createSchedule = async (): Promise<any> => {
  try {
    const response = await apiPost('schedules', {
      method: 'POST',
    });

    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', JSON.stringify(error));
    throw error;
  }
};
