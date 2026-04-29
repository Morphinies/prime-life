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

  const [projectListResp, allProjectsResp, taskListResp] = await Promise.all([
    projectApi.getList(filters.project ? { project: filters.project } : undefined),
    projectApi.getList(),
    taskApi.getList({
      period: 'all',
      project: filters.project,
    }),
  ]);

  return {
    projectList: projectListResp.data,
    allProjects: allProjectsResp.data,
    taskList: taskListResp.data,
  };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { projectList, allProjects, taskList } = (loaderData || {}) as LoaderData;
  const { headController, modalProject } = content;
  const filters = getProjectListFilters(searchParams);
  const title = getProjectListTitle(filters);
  const projectFilters = getProjectFilters(allProjects);

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
        modalProject={modalProject}
        defaultTasks={taskList}
        defaultProjects={projectList}
      />
    </Flex>
  );
}
