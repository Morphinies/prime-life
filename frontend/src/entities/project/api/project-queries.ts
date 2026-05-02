import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { arrayMove } from '@dnd-kit/sortable';
import { projectApi } from './project-api';
import type { UseQueryOptions } from '@/shared/api/types';
import type {
  CreateProjectDto,
  Project,
  ProjectListFilters,
  UpdateProjectDto,
} from '../model/types';
import { taskKeys } from '@/entities/task';

type ProjectListRequestFilters = Pick<ProjectListFilters, 'project' | 'search' | 'status'>;

type ReorderProjectsParams = {
  list: Pick<Project, 'id' | 'sortOrder'>[];
  oldIndex: number;
  newIndex: number;
};

type ReorderProjectsResult = {
  reorderedItems: Pick<Project, 'id' | 'sortOrder'>[];
  targetItemId: Project['id'];
  newSortOrder: number;
};

type ReorderProjectsContext = {
  previousProject?: Project;
};

const getReorderData = ({
  list,
  oldIndex,
  newIndex,
}: ReorderProjectsParams): ReorderProjectsResult => {
  if (oldIndex === newIndex) {
    const currentItem = list[oldIndex];
    if (!currentItem) throw new Error('targetItemId not found');

    return {
      reorderedItems: list,
      targetItemId: currentItem.id,
      newSortOrder: currentItem.sortOrder,
    };
  }

  const targetItemId = list[oldIndex].id;
  if (!targetItemId) throw new Error('targetItemId not found');

  const isOrderDesc = true;
  const inc = isOrderDesc ? 1 : -1;
  let newSortOrder: number;

  if (newIndex === 0) {
    newSortOrder = list[0].sortOrder + inc;
  } else if (newIndex === list.length - 1) {
    newSortOrder = list[list.length - 1].sortOrder - inc;
  } else {
    const isMoveDown = newIndex > oldIndex;

    newSortOrder = Number(
      ((list[newIndex + (isMoveDown ? 1 : -1)].sortOrder + list[newIndex].sortOrder) / 2).toFixed(4)
    );
  }

  const reorderedItems = list.map((item) =>
    item.id === targetItemId ? { ...item, sortOrder: newSortOrder } : item
  );

  return {
    reorderedItems: arrayMove(reorderedItems, oldIndex, newIndex),
    targetItemId,
    newSortOrder,
  };
};

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

export const useReorderProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      list,
      oldIndex,
      newIndex,
    }: ReorderProjectsParams): Promise<ReorderProjectsResult> => {
      const reorderData = getReorderData({ list, oldIndex, newIndex });

      await projectApi.move(reorderData.targetItemId, { sortOrder: reorderData.newSortOrder });

      return reorderData;
    },

    onMutate: async ({
      list,
      oldIndex,
      newIndex,
    }: ReorderProjectsParams): Promise<ReorderProjectsContext> => {
      const { targetItemId } = getReorderData({ list, oldIndex, newIndex });
      const previousProject = queryClient.getQueryData<Project>(projectKeys.detail(targetItemId));

      return {
        previousProject,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context?.previousProject) return;

      queryClient.setQueryData<Project>(
        projectKeys.detail(context.previousProject.id),
        context.previousProject
      );
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData<Project>(projectKeys.detail(data.targetItemId), (old) =>
        old ? { ...old, sortOrder: data.newSortOrder } : old
      );
    },
  });
};
