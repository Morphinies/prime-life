import Substrate from '@/widgets/Substrate';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { Flex, Progress as AntdProgress, Typography } from 'antd';

const { Title, Text } = Typography;

export interface ProgressProps {
  title: string;
  percent: number;
  desc: string;
  descRight: string;
}

const Progress = ({ title, percent, desc, descRight }: ProgressProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.size }} justify="space-between" full fullHeight>
      <Title level={4} children={title} />
      <AntdProgress
        type="circle"
        percent={percent}
        style={{
          alignSelf: 'center',
        }}
      />
      <Flex justify="space-between">
        <Text children={desc} />
        <Text type="success" children={descRight} />
      </Flex>
    </Substrate>
  );
};

export default Progress;
