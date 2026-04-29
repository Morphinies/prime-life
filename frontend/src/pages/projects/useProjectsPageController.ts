import { useMemo, useState } from 'react';
import { getEditedObject } from '@/shared/utils/transformer';
import {
  useCreateProject,
  useDeleteProject,
  useProjectList,
  useUpdateProject,
  type CreateProjectDto,
  type Project,
  type ProjectEdit,
  type ProjectListFilters,
  type UpdateProjectDto,
} from '@/entities/project';
import { useTaskList, type Task } from '@/entities/task';

type UseProjectsPageControllerParams = {
  filters: ProjectListFilters;
  defaultProjects?: Project[];
  defaultTasks?: Task[];
};

type ProjectSection = {
  title?: string;
  tasks: Task[];
};

export type ProjectWithSections = Project & {
  sections: ProjectSection[];
};

function getProjectSections(tasks: Task[]): ProjectSection[] {
  const sectionsMap = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const sectionTitle = task.section || '';
    const currentSectionTasks = sectionsMap.get(sectionTitle) || [];
    currentSectionTasks.push(task);
    sectionsMap.set(sectionTitle, currentSectionTasks);
  });

  return [...sectionsMap.entries()].map(([title, sectionTasks]) => ({
    title: title || undefined,
    tasks: sectionTasks,
  }));
}

export function useProjectsPageController({
  filters,
  defaultProjects = [],
  defaultTasks = [],
}: UseProjectsPageControllerParams) {
  const [projectEdit, setProjectEdit] = useState<ProjectEdit | null>(null);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const modalProjectError =
    updateProject.error?.message || createProject.error?.message || deleteProject.error?.message;

  const queryFilters = { project: filters.project };
  const { data: projects = defaultProjects } = useProjectList(queryFilters, {
    initialData: defaultProjects,
  });
  const { data: tasks = defaultTasks } = useTaskList(
    { period: 'all', project: filters.project },
    {
      initialData: defaultTasks,
    }
  );

  const projectsWithSections = useMemo<ProjectWithSections[]>(
    () =>
      projects.map((project) => ({
        ...project,
        sections: getProjectSections(tasks.filter((task) => task.project === project.title)),
      })),
    [projects, tasks]
  );

  const [defaultProject] = useState<ProjectEdit>({
    title: '',
    description: '',
  });

  const handleSubmit = async (project: UpdateProjectDto | CreateProjectDto) => {
    if (!projectEdit) {
      console.error('projectEdit is not found');
      return;
    }

    const isEditing = 'id' in project && !!project.id;

    if (isEditing) {
      await updateProject.mutateAsync({
        id: project.id!,
        data: getEditedObject(projectEdit, project),
      });
    } else {
      await createProject.mutateAsync(project as CreateProjectDto);
    }

    setProjectEdit(null);
  };

  const handleDelete = async (projectId: Project['id']) => {
    await deleteProject.mutateAsync(projectId);
  };

  const handleArchive = async (projectId: Project['id'], isArchived: boolean) => {
    await updateProject.mutateAsync({
      id: projectId,
      data: { isArchived },
    });
  };

  const hideModal = () => {
    setProjectEdit(null);
  };

  const showModal = (project?: Project) => {
    if (!project) {
      setProjectEdit(defaultProject);
      return;
    }

    setProjectEdit({
      id: project.id,
      title: project.title,
      description: project.description,
      isArchived: project.isArchived,
    });
  };

  return {
    projectEdit,
    projects: projectsWithSections,
    showModal,
    hideModal,
    handleSubmit,
    handleDelete,
    handleArchive,
    modalProjectError,
  };
}
