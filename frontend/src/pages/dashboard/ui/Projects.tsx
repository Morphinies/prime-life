import { Card, Flex, Progress, Tag, Typography, type ProgressProps, type TagProps } from 'antd';
import Substrate from '@/widgets/Substrate';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { COLORS, type Color } from '@/app/constants';

const { Title, Text } = Typography;

export interface ProjectsProps {
  title: string;
  list: {
    id: string;
    color?: Color;
    title?: string;
    text?: string | string[];
    progress?: ProgressProps;
    tag?: TagProps;
  }[];
}

const Projects = ({ title, list = [] }: ProjectsProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.size }} full fullHeight>
      <Title level={4} children={title} />

      <Flex vertical gap="medium">
        {list.map(({ id, color = 'blue', title, text, progress, tag }) => (
          <Card
            key={id}
            size="small"
            styles={{
              body: {
                gap: token.sizeMD,
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Flex justify="space-between" align="flex-start">
              <Flex vertical>
                <Title level={5} children={title} />
                <Text type="secondary" children={Array.isArray(text) ? text.join(' • ') : text} />
              </Flex>
              <Tag color={COLORS[color]} {...tag} />
            </Flex>
            <Progress styles={{ track: { background: COLORS[color] } }} {...progress} />
          </Card>
        ))}
      </Flex>
    </Substrate>
  );
};

export default Projects;
