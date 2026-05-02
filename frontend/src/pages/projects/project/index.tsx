import { Link } from 'react-router';
import type { Task } from '@/entities/task';
import { Card, Flex, Typography } from 'antd';
import { taskApi } from '@/entities/task/api/task-api';
import TaskSectionsList from '@/shared/ui/TaskSectionsList';
import { projectApi } from '@/entities/project/api/project-api';
import type { Route } from './+types/index';

const { Title, Text } = Typography;

type LoaderData = {
  project: Awaited<ReturnType<typeof projectApi.getDetail>>['data'];
  tasks: Task[];
};

export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const id = params.id;
  if (!id) throw new Response('Project id is required', { status: 400 });

  const project = await projectApi.getDetail(id).then((res) => res.data);
  const [activeTasks, completedTasks, archivedTasks] = await Promise.all([
    taskApi.getList({ project: project.title, status: 'active' }).then((res) => res.data),
    taskApi.getList({ project: project.title, status: 'completed' }).then((res) => res.data),
    taskApi.getList({ project: project.title, status: 'archived' }).then((res) => res.data),
  ]);

  return {
    project,
    tasks: [...activeTasks, ...completedTasks, ...archivedTasks],
  };
}

export default function ProjectDetails({ loaderData }: Route.ComponentProps) {
  const { project, tasks } = loaderData as unknown as LoaderData;

  return (
    <Flex vertical gap="large" className="container">
      <Flex align="center" justify="space-between" wrap gap="middle">
        <Flex vertical gap="small">
          <Text type="secondary">
            <Link to="/projects">Проекты</Link>
          </Text>
          <Title level={2} style={{ margin: 0 }}>
            {project.title}
          </Title>
          {project.description && <Text type="secondary">{project.description}</Text>}
        </Flex>
      </Flex>

      <Card>
        <TaskSectionsList
          tasks={tasks}
          groupBySection={(task) => task.section || undefined}
          emptyDescription="В проекте пока нет задач"
          withActions={false}
          withDoneStateDecoration={true}
        />
      </Card>
    </Flex>
  );
}
