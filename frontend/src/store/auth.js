import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || '',
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  login: async (email, password) => {
    // Call backend to get a fake token
    const res = await axios.post('http://localhost:3001/login', { email, password });
    set({ token: res.data.token });
    localStorage.setItem('token', res.data.token);
  },
  logout: () => {
    // Remove token from local storage and state
    localStorage.removeItem('token');
    set({ token: '' });
  },
})); 