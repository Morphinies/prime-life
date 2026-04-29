import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from './project-api';
import type { UseQueryOptions } from '@/shared/api/types';
import type { CreateProjectDto, Project, ProjectListFilters, UpdateProjectDto } from '../model/types';
import { taskKeys } from '@/entities/task';

type ProjectListRequestFilters = Pick<ProjectListFilters, 'project'>;

export const projectKeys = {
  all: ['projects'] as const,
  list: (filters?: ProjectListRequestFilters) => [...projectKeys.all, 'list', filters] as const,
  detail: (id: Project['id']) => [...projectKeys.all, 'detail', id] as const,
};

export const useProjectList = (
  filters?: ProjectListRequestFilters,
  options: UseQueryOptions<Project[]> = {}
) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectApi.getList(filters).then((res) => res.data),
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

export const useProject = (id: Project['id']) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.getDetail(id).then((res) => res.data),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectApi.create(data).then((res) => res.data),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: Project['id']; data: UpdateProjectDto }) =>
      projectApi.update(id, data).then((res) => res.data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Project['id']) => projectApi.delete(id).then((res) => ({ ...res.data, id })),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
};
