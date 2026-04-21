import type { CreateTaskDto, Task, TaskListFilters, UpdateTaskDto } from '../model/types';
import { apiClient } from '@/shared/api/axios-instance';
import type { StatusResponse } from '@/shared/api/types';
import { API_ENDPOINTS } from '@/shared/config/api-endpoints';

type TaskListRequestFilters = Pick<TaskListFilters, 'period' | 'project'>;

export const taskApi = {
  getList: (filters?: TaskListRequestFilters) =>
    apiClient.get<Task[]>(API_ENDPOINTS.tasks.list, { params: filters }),
  getDetail: (id: Task['id']) => apiClient.get<Task>(API_ENDPOINTS.tasks.detail(id)),
  create: (data: CreateTaskDto) => apiClient.post<Task>(API_ENDPOINTS.tasks.create, data),
  delete: (id: Task['id']) => apiClient.delete<StatusResponse>(API_ENDPOINTS.tasks.delete(id)),
  update: (id: Task['id'], data: UpdateTaskDto) =>
    apiClient.put<Task>(API_ENDPOINTS.tasks.update(id), data),
  move: (id: Task['id'], data: { sortOrder: number }) =>
    apiClient.put<StatusResponse>(API_ENDPOINTS.tasks.move(id), data),
};
