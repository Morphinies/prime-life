import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import Task, { type TaskProps } from '@/shared/ui/TaskCard';
import { Card, Divider, Flex, Typography } from 'antd';
import React from 'react';
const { Title } = Typography;

export interface TasksSectionsProps {
  sections: { title: string; tasks: TaskProps[] }[];
}

const TasksSections = ({ sections }: TasksSectionsProps) => {
  const { cssVar, isDark } = useThemeToken();

  return (
    <Flex vertical gap="medium">
      {sections.map(({ title, tasks }, index) => (
        <Card
          key={index}
          styles={{
            root: { background: 'transparent', borderColor: cssVar.colorFillTertiary },
            header: {
              background: cssVar.colorFillTertiary,
              border: 'none',
            },
            body: {
              background: isDark ? undefined : cssVar.colorBgContainer,
            },
          }}
          extra={'+ todo'}
          title={<Title level={4} children={title} />}
        >
          <Flex vertical key={index}>
            {tasks.map((task, index) => (
              <React.Fragment key={index}>
                {!!index && (
                  <Divider
                    style={{
                      borderColor: cssVar.colorFillTertiary,
                    }}
                  />
                )}
                <Task key={index} {...task} />
              </React.Fragment>
            ))}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default TasksSections;
