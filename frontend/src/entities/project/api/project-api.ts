import type { CreateProjectDto, Project, ProjectListFilters, UpdateProjectDto } from '../model/types';
import { apiClient } from '@/shared/api/axios-instance';
import type { StatusResponse } from '@/shared/api/types';
import { API_ENDPOINTS } from '@/shared/config/api-endpoints';

type ProjectListRequestFilters = Pick<ProjectListFilters, 'project'>;

export const projectApi = {
  getList: (filters?: ProjectListRequestFilters) =>
    apiClient.get<Project[]>(API_ENDPOINTS.projects.list, { params: filters }),
  getDetail: (id: Project['id']) => apiClient.get<Project>(API_ENDPOINTS.projects.detail(id)),
  create: (data: CreateProjectDto) => apiClient.post<Project>(API_ENDPOINTS.projects.create, data),
  delete: (id: Project['id']) => apiClient.delete<StatusResponse>(API_ENDPOINTS.projects.delete(id)),
  update: (id: Project['id'], data: UpdateProjectDto) =>
    apiClient.put<Project>(API_ENDPOINTS.projects.update(id), data),
};
