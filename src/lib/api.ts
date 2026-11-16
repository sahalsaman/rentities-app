import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const signUp = (phone: string, countryCode: string, name: string, lastName: string, businessName: string) => api.post('/auth/signup', { phone, countryCode, name, lastName, businessName });

export const login = (phone: string, countryCode: string) => api.post('/auth/login', { phone, countryCode });

export const getSession = () => api.get('/auth/session');

export const logout = () => api.post('/auth/logout');

export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // send cookies
  });

  return res;
}

export default api;
