import { Flex } from 'antd';
import content from './content';
import type { Route } from '../+types/home';
import HeadController from './ui/HeadController';
import TaskList, { type TaskListProps } from './ui/TaskList';

type LoaderData = {
  taskList: TaskListProps['list'];
};

export async function loader({}: Promise<LoaderData>) {
  const taskListResp = await fetch('http://localhost:5000/tasks');
  const taskList: TaskListProps['list'] = await taskListResp.json();
  return { taskList };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const { taskList } = (loaderData || {}) as LoaderData;
  const { headController, tasks } = content;

  return (
    <Flex vertical gap="large" className="container">
      <HeadController {...headController} />
      <TaskList {...tasks} list={taskList} />
    </Flex>
  );
}
