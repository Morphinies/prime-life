import type {
  TaskListFilters,
  TaskListPeriod,
  TaskListStatus,
  TaskListView,
} from '@/entities/task';
import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  HeadController as SharedHeadController,
  type HeadControllerOption,
} from '@/shared/ui/HeadController';

const SHOW_CUSTOM_PERIOD_FILTER = false;

export interface HeadControllerConfigProps {
  title: string;
  periodFilters: HeadControllerOption[];
  statusFilters: HeadControllerOption[];
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
  statusFilters,
  projectFilters,
  viewSettings,
  onAddTask,
  onFiltersChange,
}: HeadControllerProps) => {
  const dateRangeValue =
    filters.dateFrom && filters.dateTo
      ? ([dayjs(filters.dateFrom), dayjs(filters.dateTo)] as [Dayjs, Dayjs])
      : null;

  return (
    <SharedHeadController
      title={title}
      titleAction={{
        label: '+ Добавить задачу',
        onClick: onAddTask,
      }}
      searchFilter={{
        value: filters.search,
        placeholder: 'Поиск',
        onChange: (search) => onFiltersChange({ ...filters, search }),
      }}
      leftSelectFilters={[
        {
          allowClear: true,
          value: filters.period,
          placeholder: 'Период',
          options: periodFilters,
          onChange: (period) =>
            onFiltersChange({
              ...filters,
              period: period as TaskListPeriod | undefined,
              dateFrom: undefined,
              dateTo: undefined,
            }),
        },
        {
          value: filters.status,
          placeholder: 'Статус',
          options: statusFilters,
          onChange: (status) => onFiltersChange({ ...filters, status: status as TaskListStatus }),
        },
        {
          allowClear: true,
          value: filters.project,
          placeholder: 'Проект',
          minWidth: 180,
          options: projectFilters,
          onChange: (project) => onFiltersChange({ ...filters, project }),
        },
      ]}
      leftControls={
        SHOW_CUSTOM_PERIOD_FILTER
          ? [
              <DatePicker.RangePicker
                allowClear
                value={dateRangeValue}
                format="DD.MM.YYYY"
                placeholder={['С даты', 'По дату']}
                onChange={(dates) =>
                  onFiltersChange({
                    ...filters,
                    period: undefined,
                    dateFrom: dates?.[0]?.format('YYYY-MM-DD'),
                    dateTo: dates?.[1]?.format('YYYY-MM-DD'),
                  })
                }
              />,
            ]
          : []
      }
      viewSelect={{
        value: filters.view,
        options: viewSettings,
        onChange: (view) => onFiltersChange({ ...filters, view: view as TaskListView }),
      }}
    />
  );
};

export default HeadController;
