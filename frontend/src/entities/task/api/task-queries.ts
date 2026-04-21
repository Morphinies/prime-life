import { taskApi } from './task-api';
import { arrayMove } from '@dnd-kit/sortable';
import type { UseQueryOptions } from '@/shared/api/types';
import type { CreateTaskDto, Task, TaskListFilters, UpdateTaskDto } from '../model/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ReorderTasksParams = {
  list: Pick<Task, 'id' | 'sortOrder'>[];
  oldIndex: number;
  newIndex: number;
};

type ReorderTasksResult = {
  reorderedItems: Pick<Task, 'id' | 'sortOrder'>[];
  targetItemId: Task['id'];
  newSortOrder: number;
};

type ReorderTasksContext = {
  previousTask?: Task;
};

type TaskListRequestFilters = Pick<TaskListFilters, 'period' | 'project'>;

const getReorderData = ({ list, oldIndex, newIndex }: ReorderTasksParams): ReorderTasksResult => {
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

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters?: TaskListRequestFilters) => [...taskKeys.all, 'list', filters] as const,
  detail: (id: Task['id']) => [...taskKeys.all, 'detail', id] as const,
};

export const useTaskList = (
  filters?: TaskListRequestFilters,
  options: UseQueryOptions<Task[]> = {}
) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getList(filters).then((res) => res.data),
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
};

export const useTask = (id: Task['id']) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getDetail(id),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => taskApi.create(data).then((res) => res.data),

    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(newTask.id), newTask);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Task['id']) => taskApi.delete(id).then((res) => ({ ...res.data, id })),

    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: Task['id']; data: UpdateTaskDto }) =>
      taskApi.update(id, data).then((res) => res.data),

    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      list,
      oldIndex,
      newIndex,
    }: ReorderTasksParams): Promise<ReorderTasksResult> => {
      const reorderData = getReorderData({ list, oldIndex, newIndex });

      await taskApi.move(reorderData.targetItemId, { sortOrder: reorderData.newSortOrder });

      return reorderData;
    },

    onMutate: async ({
      list,
      oldIndex,
      newIndex,
    }: ReorderTasksParams): Promise<ReorderTasksContext> => {
      const { targetItemId } = getReorderData({ list, oldIndex, newIndex });
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(targetItemId));

      return {
        previousTask,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context?.previousTask) return;

      queryClient.setQueryData<Task>(
        taskKeys.detail(context.previousTask.id),
        context.previousTask
      );
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData<Task>(taskKeys.detail(data.targetItemId), (old) =>
        old ? { ...old, sortOrder: data.newSortOrder } : old
      );
    },
  });
};
