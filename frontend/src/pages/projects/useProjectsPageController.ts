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
import {
  useDeleteTask,
  useTaskList,
  useCreateTask,
  useUpdateTask,
  type CreateTaskDto,
  type Task,
  type TaskEdit,
} from '@/entities/task';

type UseProjectsPageControllerParams = {
  filters: ProjectListFilters;
  defaultProjects?: Project[];
  defaultTasks?: Task[];
  defaultAllTasks?: Task[];
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
  defaultAllTasks = [],
}: UseProjectsPageControllerParams) {
  const [projectEdit, setProjectEdit] = useState<ProjectEdit | null>(null);
  const [taskEdit, setTaskEdit] = useState<TaskEdit | null>(null);
  const [projectForTaskAdding, setProjectForTaskAdding] = useState<Project | null>(null);
  const [locallyAddedTasks, setLocallyAddedTasks] = useState<Task[]>([]);
  const [locallyRemovedTaskIds, setLocallyRemovedTaskIds] = useState<Task['id'][]>([]);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createTask = useCreateTask();

  const modalProjectError =
    updateProject.error?.message || createProject.error?.message || deleteProject.error?.message;
  const addTaskToProjectError = updateTask.error?.message;
  const modalTaskError =
    updateTask.error?.message || deleteTask.error?.message || createTask.error?.message;

  const queryFilters = { project: filters.project, status: filters.status };
  const { data: projects = defaultProjects } = useProjectList(queryFilters, {
    initialData: defaultProjects,
  });
  const { data: tasks = defaultTasks } = useTaskList(
    { period: 'all', project: filters.project },
    {
      initialData: defaultTasks,
    }
  );
  const { data: allTasks = defaultAllTasks } = useTaskList(
    { period: 'all' },
    {
      initialData: defaultAllTasks,
    }
  );

  const tasksForSections = useMemo(() => {
    const taskById = new Map(tasks.map((task) => [task.id, task]));

    locallyAddedTasks.forEach((task) => {
      taskById.set(task.id, task);
    });

    locallyRemovedTaskIds.forEach((taskId) => {
      taskById.delete(taskId);
    });

    return [...taskById.values()];
  }, [locallyAddedTasks, locallyRemovedTaskIds, tasks]);

  const tasksAvailableForAdding = useMemo(
    () =>
      allTasks.filter(
        (task) => !task.project && !locallyAddedTasks.some(({ id }) => id === task.id)
      ),
    [allTasks, locallyAddedTasks]
  );

  const projectsWithSections = useMemo<ProjectWithSections[]>(
    () =>
      projects.map((project) => ({
        ...project,
        sections: getProjectSections(
          tasksForSections.filter((task) => task.project === project.title)
        ),
      })),
    [projects, tasksForSections]
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

  const showTaskModal = (task: Task) => {
    setTaskEdit({
      id: task.id,
      title: task.title,
      section: task.section,
      project: task.project,
      priority: task.priority,
      description: task.description,
      isCompleted: task.isCompleted,
      deadline: task.deadline,
    });
  };

  const showCreateTaskModal = () => {
    if (!projectForTaskAdding) return;

    setTaskEdit({
      title: '',
      description: '',
      project: projectForTaskAdding.title,
      isCompleted: false,
      deadline: undefined,
      priority: undefined,
    });
  };

  const hideTaskModal = () => {
    setTaskEdit(null);
  };

  const showAddTasksModal = (project: Project) => {
    setProjectForTaskAdding(project);
  };

  const hideAddTasksModal = () => {
    setProjectForTaskAdding(null);
  };

  const handleAddTaskToProject = async (taskId: Task['id']) => {
    if (!projectForTaskAdding) return;

    const updatedTask = await updateTask.mutateAsync({
      id: taskId,
      data: { project: projectForTaskAdding.title },
    });

    setLocallyAddedTasks((currentTasks) => [
      ...currentTasks.filter((task) => task.id !== updatedTask.id),
      updatedTask,
    ]);
  };

  const handleTaskSubmit = async (task: TaskEdit) => {
    const isEditing = !!taskEdit?.id;
    const updatedTask = isEditing
      ? await updateTask.mutateAsync({
          id: taskEdit.id!,
          data: getEditedObject(taskEdit, task),
        })
      : await createTask.mutateAsync(task as CreateTaskDto);

    setLocallyAddedTasks((currentTasks) => [
      ...currentTasks.filter((task) => task.id !== updatedTask.id),
      updatedTask,
    ]);
    setTaskEdit(null);
  };

  const handleTaskComplete = async (taskId: Task['id'], isCompleted: boolean) => {
    const updatedTask = await updateTask.mutateAsync({
      id: taskId,
      data: { isCompleted },
    });

    if (updatedTask.isCompleted || updatedTask.isArchived) {
      setLocallyRemovedTaskIds((currentIds) => [...new Set([...currentIds, updatedTask.id])]);
      return;
    }

    setLocallyAddedTasks((currentTasks) => [
      ...currentTasks.filter((task) => task.id !== updatedTask.id),
      updatedTask,
    ]);
  };

  const handleTaskArchive = async (taskId: Task['id'], isArchived: boolean) => {
    const updatedTask = await updateTask.mutateAsync({
      id: taskId,
      data: { isArchived },
    });

    if (updatedTask.isCompleted || updatedTask.isArchived) {
      setLocallyRemovedTaskIds((currentIds) => [...new Set([...currentIds, updatedTask.id])]);
      return;
    }

    setLocallyAddedTasks((currentTasks) => [
      ...currentTasks.filter((task) => task.id !== updatedTask.id),
      updatedTask,
    ]);
  };

  const handleTaskDelete = async (taskId: Task['id']) => {
    await deleteTask.mutateAsync(taskId);
    setLocallyRemovedTaskIds((currentIds) => [...new Set([...currentIds, taskId])]);
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
    taskEdit,
    projectForTaskAdding,
    projects: projectsWithSections,
    tasksAvailableForAdding,
    showModal,
    hideModal,
    showTaskModal,
    showCreateTaskModal,
    hideTaskModal,
    showAddTasksModal,
    hideAddTasksModal,
    handleSubmit,
    handleDelete,
    handleArchive,
    handleAddTaskToProject,
    handleTaskSubmit,
    handleTaskComplete,
    handleTaskArchive,
    handleTaskDelete,
    modalProjectError,
    modalTaskError,
    addTaskToProjectError,
    isAddingTaskToProject: updateTask.isPending,
  };
}
