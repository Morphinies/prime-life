import type { UseQueryOptions as UseQueryOptionsRQ } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type UseQueryOptions<T, K extends keyof UseQueryOptionsRQ = 'queryKey' | 'queryFn'> = Omit<
  UseQueryOptionsRQ<T, AxiosError>,
  K
>;

export type StatusResponse = {
  status: 'success' | 'error';
  message?: string;
};
