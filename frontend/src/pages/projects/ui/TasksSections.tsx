import { useMemo } from 'react';
import { Button, Card, Divider, Empty, Flex, Modal, Typography } from 'antd';
import { useThemeMode } from '@/features/theme';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import type { ProjectListFilters } from '@/entities/project';
import type { Task } from '@/entities/task';
import TaskCard from '@/entities/task/ui/TaskCard';
import ActionMenu from '@/shared/ui/ActionMenu';
import ModalProject, { type ModalProjectProps } from './ModalProject';
import { useProjectsPageController } from '../useProjectsPageController';

const { Title, Text } = Typography;

export interface TasksSectionsProps {
  filters: ProjectListFilters;
  defaultTasks?: Task[];
  defaultProjects?: {
    id: string;
    title: string;
    description?: string;
    isArchived: boolean;
  }[];
  modalProject: Pick<ModalProjectProps, 'fields'>;
}

const TasksSections = ({
  filters,
  defaultTasks = [],
  defaultProjects = [],
  modalProject,
}: TasksSectionsProps) => {
  const { cssVar } = useThemeToken();
  const { isDarkTheme } = useThemeMode();
  const {
    projectEdit,
    projects,
    showModal,
    hideModal,
    handleSubmit,
    handleDelete,
    handleArchive,
    modalProjectError,
  } = useProjectsPageController({
    filters,
    defaultTasks,
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
                    <Flex key={`${project.id}-${section.title || 'default'}-${sectionIndex}`} vertical>
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
                            withActions={false}
                            withBottomDivider={taskIndex < section.tasks.length - 1}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  ))
                ) : (
                  <Empty description="В проекте пока нет задач" />
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
    </Flex>
  );
};

export default TasksSections;
