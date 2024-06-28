import { create } from 'zustand';
import apiRequest from './apiRequest';

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest('/users/notification');
      set((state) => ({
        ...state,
        number: res.data,
      }));
    } catch (error) {
      console.log('Ошибка при загрузке уведомлений:', error);
    }
  },
  decrease: () => {
    set((state) => ({
      ...state,
      number: state.number > 0 ? state.number - 1 : 0,
    }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
