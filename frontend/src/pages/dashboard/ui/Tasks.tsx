import { Flex, Typography } from 'antd';
import Substrate from '@/widgets/Substrate';
import Task, { type TaskProps } from '@/shared/ui/Task';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
const { Title } = Typography;

export interface TasksProps {
  title: string;
  list?: TaskProps[];
}

const Tasks = ({ title, list = [] }: TasksProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.sizeLG }} full fullHeight>
      <Title level={4} children={title} />

      <Flex vertical gap="medium">
        {list.map((task, index) => (
          <Task {...task} key={index} />
        ))}
      </Flex>
    </Substrate>
  );
};

export default Tasks;
