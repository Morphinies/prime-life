import { Flex } from 'antd';
import content from './content';
import type { Route } from '../+types/home';
import HeadController from './ui/HeadController';
import { taskApi } from '@/entities/task/api/task-api';
import TaskList, { type TaskListProps } from './ui/TaskList';

type LoaderData = {
  taskList: TaskListProps['defaultList'];
};

export async function loader({}: Promise<LoaderData>) {
  const taskListResp = await taskApi.getList();
  return { taskList: taskListResp.data };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const { taskList } = (loaderData || {}) as LoaderData;
  const { headController, tasks } = content;

  return (
    <Flex vertical gap="large" className="container">
      <HeadController {...headController} />
      <TaskList {...tasks} defaultList={taskList} />
    </Flex>
  );
}
