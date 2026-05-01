export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskListPeriod = 'day' | 'week' | 'month' | 'year';
export type TaskListStatus = 'active' | 'completed' | 'archived';
export type TaskListView = 'list';

export type Task = {
  id: string;
  title?: string;
  section?: string | null;
  project?: string | null;
  deadline?: string;
  description?: string | null;
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
  period?: TaskListPeriod;
  dateFrom?: string;
  dateTo?: string;
  status: TaskListStatus;
  view: TaskListView;
  search?: string;
  project?: string;
};
