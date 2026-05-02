import { Flex, Breadcrumb, Typography } from 'antd';
import { Link, useSearchParams } from 'react-router';
import type { Route } from './+types/index';
import { useState } from 'react';
import type { TaskListFilters } from '@/entities/task';
import { DEFAULT_TASK_LIST_FILTERS, getTaskListFilters } from '@/entities/task';
import { projectApi } from '@/entities/project/api/project-api';
import { taskApi } from '@/entities/task/api/task-api';
import TaskList, { type TaskListProps } from '@/widgets/TaskList';
import content from '../../tasks/content';
import HeadController from '../../tasks/ui/HeadController';

const { Text } = Typography;

type LoaderData = {
  project: Awaited<ReturnType<typeof projectApi.getDetail>>['data'];
  taskList: TaskListProps['defaultList'];
};

export async function loader({ params, request }: Route.LoaderArgs): Promise<LoaderData> {
  const id = params.id;
  if (!id) throw new Response('Project id is required', { status: 400 });

  const url = new URL(request.url);
  const filters = getTaskListFilters(url.searchParams);

  const project = await projectApi.getDetail(id).then((res) => res.data);
  const taskList = await taskApi
    .getList({
      period: filters.period,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      search: filters.search,
      status: filters.status,
      project: project.title,
    })
    .then((res) => res.data);

  return {
    project,
    taskList,
  };
}

export default function ProjectDetails({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createTaskSignal, setCreateTaskSignal] = useState(0);
  const { project, taskList } = loaderData as LoaderData;
  const { headController, tasks } = content;
  const filters = {
    ...getTaskListFilters(searchParams),
    project: project.title,
  } satisfies TaskListFilters;
  const title = project.title;
  const modalTask = {
    ...tasks.modalTask,
    form: {
      initialValues: {
        project: [project.title],
      },
    },
  };

  const handleFiltersChange = (nextFilters: TaskListFilters) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (!nextFilters.period) {
      nextSearchParams.delete('period');
    } else {
      nextSearchParams.set('period', nextFilters.period);
    }

    if (!nextFilters.dateFrom) {
      nextSearchParams.delete('dateFrom');
    } else {
      nextSearchParams.set('dateFrom', nextFilters.dateFrom);
    }

    if (!nextFilters.dateTo) {
      nextSearchParams.delete('dateTo');
    } else {
      nextSearchParams.set('dateTo', nextFilters.dateTo);
    }

    if (!nextFilters.search) {
      nextSearchParams.delete('search');
    } else {
      nextSearchParams.set('search', nextFilters.search);
    }

    if (nextFilters.status === DEFAULT_TASK_LIST_FILTERS.status) {
      nextSearchParams.delete('status');
    } else {
      nextSearchParams.set('status', nextFilters.status);
    }

    if (nextFilters.view === DEFAULT_TASK_LIST_FILTERS.view) {
      nextSearchParams.delete('view');
    } else {
      nextSearchParams.set('view', nextFilters.view);
    }

    nextSearchParams.delete('project');

    setSearchParams(nextSearchParams);
  };

  return (
    <Flex vertical className="container">
      <Flex vertical gap="small" style={{ marginBottom: 16 }}>
        <Breadcrumb
          items={[
            {
              title: <Link to="/projects">Проекты</Link>,
            },
            {
              title: <Text type="secondary">{project.title}</Text>,
            },
          ]}
        />
      </Flex>

      <HeadController
        {...headController}
        title={title}
        projectFilters={undefined}
        filters={filters}
        onAddTask={() => setCreateTaskSignal((signal) => signal + 1)}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        modalTask={modalTask}
        filters={filters}
        defaultList={taskList}
        createTaskSignal={createTaskSignal}
      />
    </Flex>
  );
}
