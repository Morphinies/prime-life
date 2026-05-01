import type { TaskListFilters, TaskListPeriod, TaskListView } from '@/entities/task';
import {
  HeadController as SharedHeadController,
  type HeadControllerOption,
} from '@/shared/ui/HeadController';

export interface HeadControllerConfigProps {
  title: string;
  periodFilters: HeadControllerOption[];
  extraFilters: HeadControllerOption[];
  projectFilters: HeadControllerOption[];
  viewSettings: HeadControllerOption[];
}

export interface HeadControllerProps extends HeadControllerConfigProps {
  filters: TaskListFilters;
  onAddTask: () => void;
  onFiltersChange: (filters: TaskListFilters) => void;
}

const HeadController = ({
  filters,
  title,
  periodFilters,
  extraFilters,
  projectFilters,
  viewSettings,
  onAddTask,
  onFiltersChange,
}: HeadControllerProps) => {
  const activeExtraFilter = extraFilters.find(({ value }) => value === filters.period);

  return (
    <SharedHeadController
      title={title}
      titleAction={{
        label: '+ Добавить задачу',
        onClick: onAddTask,
      }}
      buttonFilters={periodFilters.map((filter) => ({
        ...filter,
        active: filters.period === (filter.value as TaskListPeriod),
        onClick: () => onFiltersChange({ ...filters, period: filter.value as TaskListPeriod }),
      }))}
      extraFilter={{
        value: activeExtraFilter?.value,
        placeholder: 'Ещё',
        className: activeExtraFilter
          ? 'tasks-more-filter tasks-more-filter-active'
          : 'tasks-more-filter',
        options: extraFilters,
        onChange: (period) => onFiltersChange({ ...filters, period: period as TaskListPeriod }),
      }}
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
        onChange: (view) => onFiltersChange({ ...filters, view: view as TaskListView }),
      }}
    />
  );
};

export default HeadController;
