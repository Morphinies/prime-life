import { taskApi } from './task-api';
import type { Task } from '../model/types';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@/shared/api/types';

export const taskKeys = {
  list: ['tasks'] as const,
  detail: (id: Task['id']) => [...taskKeys.list, id] as const,
};

export const useTaskList = (options: UseQueryOptions<Task[]> = {}) => {
  return useQuery({
    queryKey: taskKeys.list,
    queryFn: () => taskApi.getList().then((res) => res.data),
    ...options,
  });
};

export const useTask = (id: Task['id']) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getDetail(id),
  });
};
