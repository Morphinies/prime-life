import { useSearchParams } from 'react-router';
import { Button, Flex, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import content from './content';
import type { Route } from '../+types/home';
import { useEffect, useMemo, useState } from 'react';
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
      search: filters.search,
      project: filters.project,
    }),
    projectApi.getList(),
    taskApi.getList({
      status: 'active',
      project: filters.project,
    }),
    taskApi.getList({ status: 'active' }),
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
  const [createProjectSignal, setCreateProjectSignal] = useState(0);
  const [collapsedProjectIds, setCollapsedProjectIds] = useState<string[]>([]);
  const { projectList, allProjects, taskList, allTaskList } = (loaderData || {}) as LoaderData;
  const { headController, modalProject, modalTask } = content;
  const filters = getProjectListFilters(searchParams);
  const title = getProjectListTitle(filters);
  const projectFilters = getProjectFilters(allProjects);
  const isAllProjectsCollapsed = useMemo(
    () => projectList.length > 0 && projectList.every((project) => collapsedProjectIds.includes(project.id)),
    [collapsedProjectIds, projectList]
  );

  useEffect(() => {
    setCollapsedProjectIds((currentIds) =>
      currentIds.filter((projectId) => projectList.some((project) => project.id === projectId))
    );
  }, [projectList]);

  const handleToggleAllProjects = () => {
    if (isAllProjectsCollapsed) {
      setCollapsedProjectIds([]);
      return;
    }

    setCollapsedProjectIds(projectList.map((project) => project.id));
  };

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

    if (!nextFilters.search) {
      nextSearchParams.delete('search');
    } else {
      nextSearchParams.set('search', nextFilters.search);
    }

    if (nextFilters.status === DEFAULT_PROJECT_LIST_FILTERS.status) {
      nextSearchParams.delete('status');
    } else {
      nextSearchParams.set('status', nextFilters.status);
    }

    setSearchParams(nextSearchParams);
  };

  return (
    <Flex vertical className="container">
      <HeadController
        {...headController}
        title={title}
        projectFilters={projectFilters}
        rightControls={[
          <Tooltip
            key="toggle-projects-collapse"
            title={isAllProjectsCollapsed ? 'Развернуть все проекты' : 'Свернуть все проекты'}
          >
            <Button
              variant="filled"
              color="default"
              icon={isAllProjectsCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              aria-label={isAllProjectsCollapsed ? 'Развернуть все проекты' : 'Свернуть все проекты'}
              onClick={handleToggleAllProjects}
            />
          </Tooltip>,
        ]}
        filters={filters}
        onAddProject={() => setCreateProjectSignal((signal) => signal + 1)}
        onFiltersChange={handleFiltersChange}
      />
      <TasksSections
        filters={filters}
        modalTask={taskModal}
        modalProject={modalProject}
        createProjectSignal={createProjectSignal}
        defaultTasks={taskList}
        defaultAllTasks={allTaskList}
        defaultProjects={projectList}
        collapsedProjectIds={collapsedProjectIds}
        onToggleProjectCollapse={(projectId) =>
          setCollapsedProjectIds((currentIds) =>
            currentIds.includes(projectId)
              ? currentIds.filter((id) => id !== projectId)
              : [...currentIds, projectId]
          )
        }
      />
    </Flex>
  );
}
