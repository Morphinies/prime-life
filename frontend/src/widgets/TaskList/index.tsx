import { Button, Flex } from 'antd';
import { type Task, type TaskListFilters } from '@/entities/task';
import TaskCard from '@/entities/task/ui/TaskCard';
import { SortContext } from '@/shared/ui/SortContext';
import ModalTask, { type ModalTaskProps } from './ModalTask';
import { useTaskListController } from './useTaskListController';

export interface TaskListProps {
  filters: TaskListFilters;
  defaultList?: Task[];
  modalTask: Pick<ModalTaskProps, 'fields' | 'bottomFields'>;
}

const TaskList = ({ filters, defaultList = [], modalTask }: TaskListProps) => {
  const {
    taskEdit,
    filteredList,
    showModal,
    hideModal,
    handleSubmit,
    handleDelete,
    handleReorder,
    handleArchive,
    handleComplete,
    modalTaskError,
  } = useTaskListController({ defaultList, filters });

  return (
    <Flex vertical gap="large">
      <SortContext list={filteredList} handleReorder={handleReorder}>
        <Flex vertical>
          {filteredList.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              withSort={true}
              withBottomDivider={true}
              handleEdit={() => showModal(task)}
              handleDelete={() => handleDelete(task.id)}
              handleArchive={() => handleArchive(task.id, !task.isArchived)}
              handleComplete={() => handleComplete(task.id, !task.isCompleted)}
            />
          ))}
        </Flex>
      </SortContext>

      <Button
        type="link"
        onClick={() => showModal()}
        children="+ Добавить задачу"
        styles={{ root: { width: 'fit-content', padding: 0 } }}
      />

      <ModalTask
        taskEdit={taskEdit}
        error={modalTaskError}
        modal={{
          open: !!taskEdit,
          onCancel: hideModal,
          toggle: () => (taskEdit ? showModal() : hideModal()),
        }}
        handleSubmit={handleSubmit}
        {...modalTask}
      />
    </Flex>
  );
};

export default TaskList;
