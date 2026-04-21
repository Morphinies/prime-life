import { Checkbox, Flex, Typography } from 'antd';
import Substrate from '@/shared/ui/Substrate';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import type { IconName } from '@/shared/ui/Icon';
import Icon from '@/shared/ui/Icon';

const { Title } = Typography;

export interface HabitsProps {
  title: string;
  list?: { icon: IconName; title: string; done: boolean }[];
}

const Habits = ({ title, list = [] }: HabitsProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.sizeLG }} full fullHeight>
      <Title level={4} children={title} />

      <Flex vertical gap="medium">
        {list.map(({ title, icon, done }, index) => (
          <Checkbox
            styles={{
              root: { display: 'flex', flexDirection: 'row-reverse' },
              label: { width: '100%', paddingLeft: 0 },
              icon: { alignSelf: 'flex-start', marginTop: '0.3em' },
            }}
            defaultChecked={done}
            key={index}
          >
            <Flex align="flex-start" justify="space-between">
              <Flex align="center" gap="small">
                <Icon name={icon} />
                <Title level={5} children={title} />
              </Flex>
            </Flex>
          </Checkbox>
        ))}
      </Flex>
    </Substrate>
  );
};

export default Habits;
