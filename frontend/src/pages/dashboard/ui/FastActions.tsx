import { Button, Flex, Typography, type ButtonProps } from 'antd';
import Substrate from '@/shared/ui/Substrate';

const { Title } = Typography;

export interface FastActionsProps {
  title?: string;
  list?: ButtonProps[];
}

const FastActions = ({ title, list }: FastActionsProps) => {
  return (
    <Substrate gap="middle" full fullHeight>
      <Title level={4} children={title} />

      <Flex gap="medium" vertical>
        {list?.map((item, index) => (
          <Button key={index} variant="solid" size="large" {...item} />
        ))}
      </Flex>
    </Substrate>
  );
};

export default FastActions;
