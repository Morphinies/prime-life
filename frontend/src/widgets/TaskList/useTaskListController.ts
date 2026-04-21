import type { TaskListProps } from '.';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import { getEditedObject } from '@/shared/utils/transformer';
import {
  useTaskList,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useReorderTasks,
  type Task,
  type CreateTaskDto,
  type UpdateTaskDto,
} from '@/entities/task';

type UseTaskListControllerParams = Pick<TaskListProps, 'defaultList' | 'filters'>;

export function useTaskListController({
  filters,
  defaultList = [],
}: UseTaskListControllerParams) {
  const [taskEdit, setTaskEdit] = useState<UpdateTaskDto | null>(null);
  const isFirstListSync = useRef(true);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const reorderTasks = useReorderTasks();

  const modalTaskError =
    updateTask.error?.message ||
    createTask.error?.message ||
    deleteTask.error?.message ||
    reorderTasks.error?.message;

  const queryFilters = { period: filters.period, project: filters.project };
  const { data: list = defaultList } = useTaskList(queryFilters, {
    initialData: defaultList,
  });

  const [listState, setListState] = useState<Task[]>(defaultList);

  useEffect(() => {
    setListState(defaultList);
  }, [defaultList]);

  useEffect(() => {
    if (isFirstListSync.current) {
      isFirstListSync.current = false;
      return;
    }

    setListState(list);
  }, [list, filters.period, filters.project]);

  const [defaultTask] = useState<UpdateTaskDto>({
    title: '',
    description: '',
    project: undefined,
    isCompleted: false,
    deadline: undefined,
    priority: undefined,
  });

  const handleSubmit = async (task: UpdateTaskDto | CreateTaskDto) => {
    if (!taskEdit) {
      console.error('taskEdit is not found');
      return;
    }

    const isEditing = 'id' in task && !!task.id;

    if (isEditing) {
      await updateTask.mutateAsync({
        id: task.id!,
        data: getEditedObject(taskEdit, task),
      });
    } else {
      await createTask.mutateAsync(task as CreateTaskDto);
    }

    setTaskEdit(null);
  };

  const handleDelete = async (taskId: Task['id']) => {
    await deleteTask.mutateAsync(taskId);
  };

  const handleComplete = async (taskId: Task['id'], isCompleted: boolean) => {
    await updateTask.mutateAsync({
      id: taskId,
      data: { isCompleted },
    });
  };

  const handleArchive = async (taskId: Task['id'], isArchived: boolean) => {
    await updateTask.mutateAsync({
      id: taskId,
      data: { isArchived },
    });
  };

  const handleReorder = async (
    list: Pick<Task, 'id' | 'sortOrder'>[],
    oldIndex: number,
    newIndex: number
  ) => {
    if (oldIndex === newIndex) return;

    const previousList = listState;
    setListState(arrayMove(listState, oldIndex, newIndex));

    try {
      await reorderTasks.mutateAsync({
        list,
        oldIndex,
        newIndex,
      });
    } catch (error) {
      setListState(previousList);
      throw error;
    }
  };

  const hideModal = () => {
    setTaskEdit(null);
  };

  const showModal = (task?: Task) => {
    if (!task) {
      setTaskEdit(defaultTask);
    } else {
      const taskEdit: UpdateTaskDto = {
        id: task.id,
        title: task.title,
        section: task.section,
        project: task.project,
        priority: task.priority,
        description: task.description,
        isCompleted: task.isCompleted,
        deadline: task.deadline,
      };
      setTaskEdit(taskEdit);
    }
  };

  return {
    taskEdit,
    filteredList: listState,
    showModal,
    hideModal,
    handleSubmit,
    handleDelete,
    handleReorder,
    handleArchive,
    handleComplete,
    modalTaskError,
  };
}
