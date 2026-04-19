import type { Task } from '../model/types';
import { apiClient } from '@/shared/api/axios-instance';
import { API_ENDPOINTS } from '@/shared/config/api-endpoints';

export const taskApi = {
  getList: () => apiClient.get<Task[]>(API_ENDPOINTS.tasks.list),
  getDetail: (id: Task['id']) => apiClient.get<Task>(API_ENDPOINTS.tasks.detail(id)),
  create: (data: Task) => apiClient.post<Task>(API_ENDPOINTS.tasks.create, data),
  delete: (id: Task['id']) => apiClient.delete<Task>(API_ENDPOINTS.tasks.delete(id)),
  update: (data: Task) => apiClient.put<Task>(API_ENDPOINTS.tasks.update(data.id), data),
};
