import type { ProjectListFilters, ProjectListStatus } from './types';

export const DEFAULT_PROJECT_LIST_FILTERS: ProjectListFilters = {
  view: 'list',
  status: 'active',
  project: undefined,
};

export function isProjectListStatus(value: string | null | undefined): value is ProjectListStatus {
  return value === 'active' || value === 'archived';
}

export function getProjectListFilters(searchParams: URLSearchParams): ProjectListFilters {
  const view = searchParams.get('view');
  const status = searchParams.get('status');
  const project = searchParams.get('project');

  return {
    view: view === 'list' ? view : DEFAULT_PROJECT_LIST_FILTERS.view,
    status: isProjectListStatus(status) ? status : DEFAULT_PROJECT_LIST_FILTERS.status,
    project: project || undefined,
  };
}

export function getProjectListTitle(filters: ProjectListFilters) {
  if (filters.project) {
    return filters.project;
  }

  return filters.status === 'archived' ? 'Архив проектов' : 'Все проекты';
}
