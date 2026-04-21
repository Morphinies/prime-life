import { useSearchParams } from 'react-router';
import { Flex } from 'antd';
import content from './content';
import type { Route } from '../+types/home';
import HeadController from './ui/HeadController';
import {
  DEFAULT_TASK_LIST_FILTERS,
  getTaskListFilters,
  getTaskListTitle,
  type Task,
  type TaskListFilters,
} from '@/entities/task';
import { taskApi } from '@/entities/task/api/task-api';
import TaskList, { type TaskListProps } from '@/widgets/TaskList';

type ProjectFilterOption = {
  label: string;
  value: string;
};

type LoaderData = {
  taskList: TaskListProps['defaultList'];
  projectFilters: ProjectFilterOption[];
};

function getProjectFilters(tasks: Task[]): ProjectFilterOption[] {
  return [...new Set(tasks.map((task) => task.project).filter((project): project is string => !!project))]
    .sort((a, b) => a.localeCompare(b, 'ru'))
    .map((project) => ({
      label: project,
      value: project,
    }));
}

export async function loader({ request }: Route.LoaderArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const filters = getTaskListFilters(url.searchParams);

  const [taskListResp, allTasksResp] = await Promise.all([
    taskApi.getList({
      period: filters.period,
      project: filters.project,
    }),
    taskApi.getList({
      period: 'all',
    }),
  ]);

  return {
    taskList: taskListResp.data,
    projectFilters: getProjectFilters(allTasksResp.data),
  };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { taskList, projectFilters } = (loaderData || {}) as LoaderData;
  const { headController, tasks } = content;
  const filters = getTaskListFilters(searchParams);
  const title = getTaskListTitle(filters);
  const modalTask = {
    ...tasks.modalTask,
    bottomFields: tasks.modalTask.bottomFields.map((field) =>
      field.name === 'project'
        ? {
            ...field,
            options: projectFilters,
          }
        : field
    ),
  };

  const handleFiltersChange = (nextFilters: TaskListFilters) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextFilters.period === DEFAULT_TASK_LIST_FILTERS.period) {
      nextSearchParams.delete('period');
    } else {
      nextSearchParams.set('period', nextFilters.period);
    }

    if (nextFilters.view === DEFAULT_TASK_LIST_FILTERS.view) {
      nextSearchParams.delete('view');
    } else {
      nextSearchParams.set('view', nextFilters.view);
    }

    if (!nextFilters.project) {
      nextSearchParams.delete('project');
    } else {
      nextSearchParams.set('project', nextFilters.project);
    }

    setSearchParams(nextSearchParams);
  };

  return (
    <Flex vertical gap="large" className="container">
      <HeadController
        {...headController}
        title={title}
        projectFilters={projectFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <TaskList modalTask={modalTask} filters={filters} defaultList={taskList} />
    </Flex>
  );
}
