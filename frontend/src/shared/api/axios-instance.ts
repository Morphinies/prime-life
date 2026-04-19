import axios from 'axios';
// import { store } from '@/app/store';
import { clientEnv } from '../config/env/env-client';

export const apiClient = axios.create({
  baseURL: clientEnv.API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  //   const token = store.getState().auth.token;
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  return config;
});
