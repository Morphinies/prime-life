import type { ProjectListFilters } from './types';

export const DEFAULT_PROJECT_LIST_FILTERS: ProjectListFilters = {
  view: 'list',
  project: undefined,
};

export function getProjectListFilters(searchParams: URLSearchParams): ProjectListFilters {
  const view = searchParams.get('view');
  const project = searchParams.get('project');

  return {
    view: view === 'list' ? view : DEFAULT_PROJECT_LIST_FILTERS.view,
    project: project || undefined,
  };
}

export function getProjectListTitle(filters: ProjectListFilters) {
  return filters.project || 'Все проекты';
}
