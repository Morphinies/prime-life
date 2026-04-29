import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { TaskListFilters, TaskListPeriod, TaskListView } from './types';

export const DEFAULT_TASK_LIST_FILTERS: TaskListFilters = {
  period: 'all',
  view: 'list',
  project: undefined,
};

export function isTaskListPeriod(value: string | null | undefined): value is TaskListPeriod {
  return (
    value === 'day' ||
    value === 'week' ||
    value === 'month' ||
    value === 'overdue' ||
    value === 'completed' ||
    value === 'archived' ||
    value === 'all'
  );
}

export function isTaskListView(value: string | null | undefined): value is TaskListView {
  return value === 'list';
}

export function getTaskListFilters(searchParams: URLSearchParams): TaskListFilters {
  const period = searchParams.get('period');
  const view = searchParams.get('view');
  const project = searchParams.get('project');

  return {
    period: isTaskListPeriod(period) ? period : DEFAULT_TASK_LIST_FILTERS.period,
    view: isTaskListView(view) ? view : DEFAULT_TASK_LIST_FILTERS.view,
    project: project || undefined,
  };
}

function formatShortDate(date: dayjs.Dayjs) {
  return date.locale('ru').format('D MMM');
}

export function getTaskListTitle(filters: TaskListFilters, now = dayjs()) {
  const current = now.locale('ru');

  if (filters.period === 'all') {
    return 'Все задачи';
  }

  if (filters.period === 'overdue') {
    return 'Просроченные';
  }

  if (filters.period === 'completed') {
    return 'Завершённые';
  }

  if (filters.period === 'archived') {
    return 'Архив';
  }

  if (filters.period === 'day') {
    return `${formatShortDate(current)} • ${current.format('dddd')}`;
  }

  const from = current.startOf(filters.period);
  const to = current.endOf(filters.period);

  return `${formatShortDate(from)} - ${formatShortDate(to)}`;
}
