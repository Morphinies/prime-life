import { useSearchParams } from 'react-router';
import { Flex } from 'antd';
import content from './content';
import type { Route } from '../+types/home';
import TasksSections from './ui/TasksSections';
import HeadController from './ui/HeadController';
import {
  DEFAULT_PROJECT_LIST_FILTERS,
  getProjectListFilters,
  getProjectListTitle,
  type Project,
  type ProjectListFilters,
} from '@/entities/project';
import { projectApi } from '@/entities/project/api/project-api';
import { taskApi } from '@/entities/task/api/task-api';
import type { Task } from '@/entities/task';

type ProjectFilterOption = {
  label: string;
  value: string;
};

type LoaderData = {
  projectList: Project[];
  allProjects: Project[];
  taskList: Task[];
  allTaskList: Task[];
};

function getProjectFilters(projects: Project[]): ProjectFilterOption[] {
  return projects.map((project) => ({
    label: project.title,
    value: project.title,
  }));
}

export async function loader({ request }: Route.LoaderArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const filters = getProjectListFilters(url.searchParams);

  const [projectListResp, allProjectsResp, taskListResp, allTaskListResp] = await Promise.all([
    projectApi.getList({
      status: filters.status,
      project: filters.project,
    }),
    projectApi.getList(),
    taskApi.getList({
      period: 'all',
      project: filters.project,
    }),
    taskApi.getList({ period: 'all' }),
  ]);

  return {
    projectList: projectListResp.data,
    allProjects: allProjectsResp.data,
    taskList: taskListResp.data,
    allTaskList: allTaskListResp.data,
  };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projectList, allProjects, taskList, allTaskList } = (loaderData || {}) as LoaderData;
  const { headController, modalProject, modalTask } = content;
  const filters = getProjectListFilters(searchParams);
  const title = getProjectListTitle(filters);
  const projectFilters = getProjectFilters(allProjects);
  const taskModal = {
    ...modalTask,
    fieldSets: modalTask.fieldSets?.map((fieldSet) => ({
      ...fieldSet,
      fields: fieldSet.fields.map((field) =>
        field.name === 'project'
          ? {
              ...field,
              options: projectFilters,
            }
          : field
      ),
    })),
  };

  const handleFiltersChange = (nextFilters: ProjectListFilters) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextFilters.view === DEFAULT_PROJECT_LIST_FILTERS.view) {
      nextSearchParams.delete('view');
    } else {
      nextSearchParams.set('view', nextFilters.view);
    }

    if (!nextFilters.project) {
      nextSearchParams.delete('project');
    } else {
      nextSearchParams.set('project', nextFilters.project);
    }

    if (nextFilters.status === DEFAULT_PROJECT_LIST_FILTERS.status) {
      nextSearchParams.delete('status');
    } else {
      nextSearchParams.set('status', nextFilters.status);
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
      <TasksSections
        filters={filters}
        modalTask={taskModal}
        modalProject={modalProject}
        defaultTasks={taskList}
        defaultAllTasks={allTaskList}
        defaultProjects={projectList}
      />
    </Flex>
  );
}
