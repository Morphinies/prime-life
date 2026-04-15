import { Flex } from 'antd';
import content from './content';
import type { Route } from '../+types/home';
import TasksSections from './ui/TasksSections';
import HeadController from './ui/HeadController';

export default function Projects({}: Route.ComponentProps) {
  const { headController, tasksSections } = content;

  return (
    <Flex vertical gap="large" className="container">
      <HeadController {...headController} />
      <TasksSections {...tasksSections} />
    </Flex>
  );
}
