import Substrate from '@/widgets/Substrate';
import { Badge, Flex, Tag, Typography } from 'antd';
import { COLORS, type Color } from '@/app/constants';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

const { Title, Text } = Typography;

export interface FinanceProps {
  title: string;
  list?: { title: string; value: string; color?: Color }[];
  cards?: { label: string; title: string; desc: string; color?: Color }[];
}

const Finance = ({ title, cards = [], list = [] }: FinanceProps) => {
  const { token } = useThemeToken();

  return (
    <Substrate style={{ minWidth: 300, gap: token.sizeLG }} full fullHeight>
      <Title level={4} children={title} />

      <Flex vertical gap="medium">
        <Flex gap="medium">
          {cards.map(({ label, title, desc, color = 'blue' }, index) => (
            <Tag style={{ flex: 1, padding: token.sizeSM }} key={index} color={COLORS[color]}>
              <Text children={label} />
              <Title level={3} children={title} />
              <Text children={desc} />
            </Tag>
          ))}
        </Flex>
        <Flex vertical gap="small">
          {list.map(({ title, value, color = 'blue' }, index) => (
            <Flex gap="small" key={index}>
              <Badge
                status="default"
                styles={{
                  root: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  indicator: {
                    width: '0.75rem',
                    height: '0.75rem',
                    background: COLORS[color],
                  },
                }}
              />
              <Text children={title} />
              <Text
                strong
                children={value}
                style={{
                  marginLeft: 'auto',
                }}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Substrate>
  );
};

export default Finance;
