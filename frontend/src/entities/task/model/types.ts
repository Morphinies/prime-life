export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskListPeriod = 'day' | 'week' | 'month' | 'overdue' | 'all';
export type TaskListView = 'list';

export type Task = {
  id: string;
  title?: string;
  section?: string;
  project?: string;
  deadline?: string;
  description?: string;
  priority?: TaskPriority;
  isCompleted?: boolean;
  isArchived?: boolean;
  sortOrder: number;
  withBottomDivider?: boolean;
};

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<Task>;
export type TaskEdit = Partial<Task>;

export type TaskListFilters = {
  period: TaskListPeriod;
  view: TaskListView;
  project?: string;
};
