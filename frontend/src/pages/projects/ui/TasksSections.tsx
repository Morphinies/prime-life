import { useMemo } from 'react';
import { Button, Card, Divider, Empty, Flex, Modal, Typography } from 'antd';
import { useThemeMode } from '@/features/theme';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import type { ProjectListFilters } from '@/entities/project';
import type { Task } from '@/entities/task';
import TaskCard from '@/entities/task/ui/TaskCard';
import ActionMenu from '@/shared/ui/ActionMenu';
import ModalTask, { type ModalTaskProps } from '@/widgets/TaskList/ModalTask';
import ModalProject, { type ModalProjectProps } from './ModalProject';
import { useProjectsPageController } from '../useProjectsPageController';

const { Title, Text } = Typography;

export interface TasksSectionsProps {
  filters: ProjectListFilters;
  defaultTasks?: Task[];
  defaultAllTasks?: Task[];
  defaultProjects?: {
    id: string;
    title: string;
    description?: string;
    isArchived: boolean;
  }[];
  modalProject: Pick<ModalProjectProps, 'fields'>;
  modalTask: Pick<ModalTaskProps, 'fields' | 'fieldSets'>;
}

const TasksSections = ({
  filters,
  defaultTasks = [],
  defaultAllTasks = [],
  defaultProjects = [],
  modalProject,
  modalTask,
}: TasksSectionsProps) => {
  const { cssVar } = useThemeToken();
  const { isDarkTheme } = useThemeMode();
  const {
    projectEdit,
    taskEdit,
    projectForTaskAdding,
    projects,
    tasksAvailableForAdding,
    showModal,
    hideModal,
    showTaskModal,
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
    isAddingTaskToProject,
  } = useProjectsPageController({
    filters,
    defaultTasks,
    defaultAllTasks,
    defaultProjects,
  });

  const isEmpty = useMemo(() => projects.length === 0, [projects.length]);

  const confirmDelete = (projectId: string) => {
    Modal.confirm({
      title: 'Удалить проект?',
      content: 'Все задачи проекта будут также удалены безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => handleDelete(projectId),
    });
  };

  return (
    <Flex vertical gap="large">
      {isEmpty ? (
        <Empty description="Проектов пока нет" />
      ) : (
        <Flex vertical gap="medium">
          {projects.map((project) => (
            <Card
              key={project.id}
              styles={{
                root: { background: 'transparent', borderColor: cssVar.colorFillTertiary },
                header: {
                  background: cssVar.colorFillTertiary,
                  border: 'none',
                },
                body: {
                  background: isDarkTheme ? undefined : cssVar.colorBgContainer,
                },
              }}
              extra={
                <ActionMenu
                  onEdit={() => showModal(project)}
                  onArchive={() => handleArchive(project.id, !project.isArchived)}
                  onDelete={() => confirmDelete(project.id)}
                />
              }
              title={<Title level={4}>{project.title}</Title>}
            >
              <Flex vertical gap="medium">
                {project.description && <Text type="secondary">{project.description}</Text>}

                {project.sections.length ? (
                  project.sections.map((section, sectionIndex) => (
                    <Flex
                      key={`${project.id}-${section.title || 'default'}-${sectionIndex}`}
                      vertical
                    >
                      {(project.sections.length > 1 || section.title) && (
                        <Flex align="center" gap="small">
                          <Divider
                            style={{
                              borderColor: cssVar.colorFillTertiary,
                              marginTop: sectionIndex ? undefined : 0,
                              marginBottom: 16,
                              flex: 1,
                            }}
                          />
                          <Text type="secondary">{section.title || 'Без секции'}</Text>
                          <Divider
                            style={{
                              borderColor: cssVar.colorFillTertiary,
                              marginTop: sectionIndex ? undefined : 0,
                              marginBottom: 16,
                              flex: 1,
                            }}
                          />
                        </Flex>
                      )}

                      <Flex vertical>
                        {section.tasks.map((task, taskIndex) => (
                          <TaskCard
                            {...task}
                            key={task.id}
                            withBottomDivider={taskIndex < section.tasks.length - 1}
                            handleEdit={() => showTaskModal(task)}
                            handleDelete={() => handleTaskDelete(task.id)}
                            handleArchive={() => handleTaskArchive(task.id, !task.isArchived)}
                            handleComplete={() => handleTaskComplete(task.id, !task.isCompleted)}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  ))
                ) : (
                  <Empty
                    description="В проекте пока нет задач"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="link" onClick={() => showAddTasksModal(project)}>
                      + Добавить задачи
                    </Button>
                  </Empty>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <Button
        type="link"
        onClick={() => showModal()}
        styles={{ root: { width: 'fit-content', padding: 0 } }}
      >
        + Добавить проект
      </Button>

      <ModalProject
        projectEdit={projectEdit}
        error={modalProjectError}
        modal={{
          open: !!projectEdit,
          onCancel: hideModal,
          toggle: () => (projectEdit ? showModal() : hideModal()),
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
        </Flex>
      </Modal>
    </Flex>
  );
};

export default TasksSections;
