import Substrate from '@/shared/ui/Substrate';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { Flex, Progress, Typography, type ProgressProps } from 'antd';
import { type Color } from '@/shared/config/colors';

const { Title, Text } = Typography;

export interface StatisticsProps {
  title: string;
  list: (ProgressProps & { id: string; color?: Color; label?: string })[];
}

const Statistics = ({ title, list = [] }: StatisticsProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.size }} full fullHeight>
      <Title level={4} children={title} />

      <Flex vertical gap="medium">
        {list.map(({ id, color, label, ...rest }, index) => (
          <Flex vertical key={index}>
            {label && <Text children={label} />}
            <Progress
              styles={{ track: { background: color ? token[color] : undefined } }}
              {...rest}
            />
          </Flex>
        ))}
      </Flex>
    </Substrate>
  );
};

export default Statistics;
