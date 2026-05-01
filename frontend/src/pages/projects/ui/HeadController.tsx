import type { ProjectListFilters, ProjectListStatus, ProjectListView } from '@/entities/project';
import {
  HeadController as SharedHeadController,
  type HeadControllerOption,
} from '@/shared/ui/HeadController';

export interface HeadControllerConfigProps {
  title: string;
  statusFilters: HeadControllerOption[];
  projectFilters: HeadControllerOption[];
  viewSettings: HeadControllerOption[];
}

export interface HeadControllerProps extends HeadControllerConfigProps {
  filters: ProjectListFilters;
  onAddProject?: () => void;
  onFiltersChange: (filters: ProjectListFilters) => void;
}

const HeadController = ({
  filters,
  title,
  statusFilters,
  projectFilters,
  viewSettings,
  onAddProject,
  onFiltersChange,
}: HeadControllerProps) => {
  return (
    <SharedHeadController
      title={title}
      titleAction={
        onAddProject && filters.status === 'active'
          ? {
              label: '+ Добавить проект',
              onClick: onAddProject,
            }
          : undefined
      }
      buttonFilters={statusFilters.map((filter) => ({
        ...filter,
        active: filters.status === (filter.value as ProjectListStatus),
        onClick: () => onFiltersChange({ ...filters, status: filter.value as ProjectListStatus }),
      }))}
      projectFilter={{
        allowClear: true,
        value: filters.project,
        placeholder: 'Проект',
        options: projectFilters,
        onChange: (project) => onFiltersChange({ ...filters, project }),
      }}
      viewSelect={{
        value: filters.view,
        options: viewSettings,
        onChange: (view) => onFiltersChange({ ...filters, view: view as ProjectListView }),
      }}
    />
  );
};

export default HeadController;
