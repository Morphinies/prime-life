import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { TaskListFilters, TaskListPeriod, TaskListStatus, TaskListView } from './types';

export const DEFAULT_TASK_LIST_FILTERS: TaskListFilters = {
  period: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  status: 'active',
  view: 'list',
  search: undefined,
  project: undefined,
};

function isDateParam(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value).isValid();
}

export function isTaskListPeriod(value: string | null | undefined): value is TaskListPeriod {
  return value === 'day' || value === 'week' || value === 'month' || value === 'year';
}

export function isTaskListStatus(value: string | null | undefined): value is TaskListStatus {
  return value === 'active' || value === 'completed' || value === 'archived';
}

export function isTaskListView(value: string | null | undefined): value is TaskListView {
  return value === 'list';
}

export function getTaskListFilters(searchParams: URLSearchParams): TaskListFilters {
  const period = searchParams.get('period');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const status = searchParams.get('status');
  const view = searchParams.get('view');
  const search = searchParams.get('search');
  const project = searchParams.get('project');

  return {
    period: isTaskListPeriod(period) ? period : DEFAULT_TASK_LIST_FILTERS.period,
    dateFrom: isDateParam(dateFrom) ? dateFrom : DEFAULT_TASK_LIST_FILTERS.dateFrom,
    dateTo: isDateParam(dateTo) ? dateTo : DEFAULT_TASK_LIST_FILTERS.dateTo,
    status: isTaskListStatus(status) ? status : DEFAULT_TASK_LIST_FILTERS.status,
    view: isTaskListView(view) ? view : DEFAULT_TASK_LIST_FILTERS.view,
    search: search?.trim() || undefined,
    project: project || undefined,
  };
}

function formatShortDate(date: dayjs.Dayjs) {
  return date.locale('ru').format('D MMM');
}

export function getTaskListTitle(filters: TaskListFilters, now = dayjs()) {
  if (filters.search) {
    return `Результаты поиска: ${filters.search}`;
  }

  if (filters.status === 'completed') {
    return 'Завершённые задачи';
  }

  if (filters.status === 'archived') {
    return 'Архив задач';
  }

  if (!filters.period) {
    if (filters.dateFrom && filters.dateTo) {
      const from = dayjs(filters.dateFrom).locale('ru');
      const to = dayjs(filters.dateTo).locale('ru');

      if (from.isSame(to, 'day')) {
        return `${formatShortDate(from)} • ${from.format('dddd')}`;
      }

      return `${formatShortDate(from)} - ${formatShortDate(to)}`;
    }

    return 'Все задачи';
  }

  const current = now.locale('ru');

  if (filters.period === 'day') {
    return `${formatShortDate(current)} • ${current.format('dddd')}`;
  }

  if (filters.period === 'month') {
    return current.format('MMMM • YYYY');
  }

  if (filters.period === 'year') {
    return `${current.format('YYYY')}г`;
  }

  const from = current.startOf(filters.period);
  const to = current.endOf(filters.period);

  return `${formatShortDate(from)} - ${formatShortDate(to)}`;
}
