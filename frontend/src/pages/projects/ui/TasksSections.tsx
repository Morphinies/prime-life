import { useSortable } from '@dnd-kit/sortable';
import { HolderOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Flex, Modal, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Project, ProjectListFilters } from '@/entities/project';
import type { Task } from '@/entities/task';
import TaskSectionsList from '@/shared/ui/TaskSectionsList';
import ActionMenu from '@/shared/ui/ActionMenu';
import { SortContext } from '@/shared/ui/SortContext';
import { useThemeMode } from '@/features/theme';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import ModalTask, { type ModalTaskProps } from '@/widgets/TaskList/ModalTask';
import ModalProject, { type ModalProjectProps } from './ModalProject';
import { useProjectsPageController, type ProjectWithSections } from '../useProjectsPageController';

const { Title, Text } = Typography;

export interface TasksSectionsProps {
  filters: ProjectListFilters;
  defaultTasks?: Task[];
  defaultAllTasks?: Task[];
  createProjectSignal?: number;
  defaultProjects?: Project[];
  modalProject: Pick<ModalProjectProps, 'fields'>;
  modalTask: Pick<ModalTaskProps, 'fields' | 'fieldSets'>;
}

type ProjectCardProps = {
  project: ProjectWithSections;
  isCollapsed: boolean;
  onToggleCollapse: (projectId: string) => void;
  onEditProject: (project: ProjectWithSections) => void;
  onArchiveProject: (project: ProjectWithSections) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTasks: (project: ProjectWithSections) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: Task['id']) => void;
  onArchiveTask: (task: Task) => void;
  onCompleteTask: (task: Task) => void;
};

function ProjectCard({
  project,
  isCollapsed,
  onToggleCollapse,
  onEditProject,
  onArchiveProject,
  onDeleteProject,
  onAddTasks,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
  onCompleteTask,
}: ProjectCardProps) {
  const sortable = useSortable({ id: project.id });
  const { cssVar } = useThemeToken();
  const { isDarkTheme } = useThemeMode();
  const tasks = project.sections.flatMap((section) => section.tasks);

  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transition: sortable.transition,
        opacity: sortable.isDragging ? 0.6 : 1,
        transform: sortable.transform
          ? `translate(${sortable.transform.x}px, ${sortable.transform.y}px)`
          : undefined,
      }}
    >
      <Card
        styles={{
          root: { background: 'transparent', borderColor: cssVar.colorFillTertiary },
          header: {
            background: cssVar.colorFillTertiary,
            border: 'none',
          },
          body: isCollapsed
            ? { display: 'none' }
            : {
                background: isDarkTheme ? undefined : cssVar.colorBgContainer,
              },
        }}
        extra={
          <ActionMenu
            archiveLabel={project.isArchived ? 'Разархивировать' : 'Архивировать'}
            onEdit={() => onEditProject(project)}
            onArchive={() => onArchiveProject(project)}
            onDelete={() => onDeleteProject(project.id)}
          />
        }
        title={
          <Flex align="center" gap="small" wrap>
            <Button
              type="text"
              icon={<HolderOutlined />}
              aria-label="Перетащить проект"
              {...sortable.attributes}
              {...sortable.listeners}
              styles={{
                root: {
                  padding: 0,
                  width: 24,
                  height: 24,
                  cursor: sortable.isDragging ? 'grabbing' : 'grab',
                },
              }}
            />
            <Button
              type="text"
              icon={isCollapsed ? <RightOutlined /> : <DownOutlined />}
              onClick={() => onToggleCollapse(project.id)}
              aria-label={isCollapsed ? 'Развернуть проект' : 'Свернуть проект'}
              styles={{ root: { padding: 0, width: 24, height: 24 } }}
            />
            <Link
              to={`/projects/${project.id}`}
              style={{ color: 'inherit', flex: 1, minWidth: 0 }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {project.title}
              </Title>
            </Link>
          </Flex>
        }
      >
        {!isCollapsed && (
          <Flex vertical gap="medium">
            {project.description && <Text type="secondary">{project.description}</Text>}

            <TaskSectionsList
              tasks={tasks}
              groupBySection={(task) => task.section || undefined}
              emptyDescription="В проекте пока нет задач"
              withDoneStateDecoration={true}
              onEditTask={onEditTask}
              onDeleteTask={(task) => onDeleteTask(task.id)}
              onArchiveTask={onArchiveTask}
              onCompleteTask={onCompleteTask}
            />

            <Button
              type="link"
              onClick={() => onAddTasks(project)}
              styles={{ root: { width: 'fit-content', padding: 0 } }}
            >
              + Добавить задачи
            </Button>
          </Flex>
        )}
      </Card>
    </div>
  );
}

const TasksSections = ({
  filters,
  defaultTasks = [],
  defaultAllTasks = [],
  createProjectSignal = 0,
  defaultProjects = [],
  modalProject,
  modalTask,
}: TasksSectionsProps) => {
  const handledCreateProjectSignal = useRef(createProjectSignal);
  const [collapsedProjectIds, setCollapsedProjectIds] = useState<string[]>([]);
  const {
    projectEdit,
    taskEdit,
    projectForTaskAdding,
    projects,
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
    handleProjectReorder,
    modalProjectError,
    modalTaskError,
    addTaskToProjectError,
    isAddingTaskToProject,
  } = useProjectsPageController({
    filters,
    defaultTasks,
    defaultAllTasks,
    defaultProjects,
  });
  const [modal, contextHolder] = Modal.useModal();

  const isEmpty = useMemo(() => projects.length === 0, [projects.length]);

  useEffect(() => {
    if (createProjectSignal > handledCreateProjectSignal.current) {
      handledCreateProjectSignal.current = createProjectSignal;
      showModal();
    }
  }, [createProjectSignal, showModal]);

  const toggleProjectCollapse = (projectId: string) => {
    setCollapsedProjectIds((currentIds) =>
      currentIds.includes(projectId)
        ? currentIds.filter((id) => id !== projectId)
        : [...currentIds, projectId]
    );
  };

  const confirmDeleteProject = (projectId: string) => {
    modal.confirm({
      title: 'Удалить проект?',
      content: 'Все задачи проекта будут также удалены безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => handleDelete(projectId),
    });
  };

  const confirmDeleteTask = (taskId: Task['id']) => {
    modal.confirm({
      title: 'Удалить задачу?',
      content: 'Задача будет удалена безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => handleTaskDelete(taskId),
    });
  };

  return (
    <Flex vertical gap="large">
      {contextHolder}

      {isEmpty ? (
        <Empty description="Проектов пока нет" />
      ) : (
        <SortContext list={projects} handleReorder={handleProjectReorder}>
          <Flex vertical gap="medium">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isCollapsed={collapsedProjectIds.includes(project.id)}
                onToggleCollapse={toggleProjectCollapse}
                onEditProject={showModal}
                onArchiveProject={(currentProject) =>
                  handleArchive(currentProject.id, !currentProject.isArchived)
                }
                onDeleteProject={confirmDeleteProject}
                onAddTasks={showAddTasksModal}
                onEditTask={showTaskModal}
                onDeleteTask={confirmDeleteTask}
                onArchiveTask={(task) => handleTaskArchive(task.id, !task.isArchived)}
                onCompleteTask={(task) => handleTaskComplete(task.id, !task.isCompleted)}
              />
            ))}
          </Flex>
        </SortContext>
      )}

      <ModalProject
        projectEdit={projectEdit}
        error={modalProjectError}
        modal={{
          open: !!projectEdit,
          onCancel: hideModal,
          toggle: () => (projectEdit ? showModal() : hideModal()),
        }}
        handleArchive={(project) => {
          if (!project.id) return;
          handleArchive(project.id, !project.isArchived);
          hideModal();
        }}
        handleDelete={(project) => {
          if (!project.id) return;
          confirmDeleteProject(project.id);
          hideModal();
        }}
        handleSubmit={handleSubmit}
        {...modalProject}
      />

      <ModalTask
        taskEdit={taskEdit}
        error={modalTaskError}
        modal={{
          open: !!taskEdit,
          onCancel: hideTaskModal,
          toggle: hideTaskModal,
        }}
        handleArchive={(task) => {
          if (!task.id) return;
          handleTaskArchive(task.id, !task.isArchived);
          hideTaskModal();
        }}
        handleDelete={(task) => {
          if (!task.id) return;
          confirmDeleteTask(task.id);
          hideTaskModal();
        }}
        handleSubmit={handleTaskSubmit}
        {...modalTask}
      />

      <Modal
        title={`Добавить задачи в проект${projectForTaskAdding ? ` "${projectForTaskAdding.title}"` : ''}`}
        open={!!projectForTaskAdding}
        onCancel={hideAddTasksModal}
        footer={null}
      >
        <Flex vertical gap="small">
          {tasksAvailableForAdding.length ? (
            tasksAvailableForAdding.map((task) => (
              <Flex key={task.id} align="center" justify="space-between" gap="middle">
                <Text>{task.title}</Text>
                <Button
                  type="link"
                  loading={isAddingTaskToProject}
                  onClick={() => handleAddTaskToProject(task.id)}
                >
                  Добавить
                </Button>
              </Flex>
            ))
          ) : (
            <Empty description="Нет задач для добавления" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          {addTaskToProjectError && <Text type="danger">{addTaskToProjectError}</Text>}

          <Button
            type="link"
            onClick={showCreateTaskModal}
            styles={{ root: { width: 'fit-content', padding: 0 } }}
          >
            + Создать новую задачу
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default TasksSections;
