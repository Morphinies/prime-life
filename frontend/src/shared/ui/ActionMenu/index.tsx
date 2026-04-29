import React from 'react';
import { Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

interface ActionMenuProps {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  archiveLabel?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onEdit,
  onArchive,
  onDelete,
  archiveLabel = 'Архивировать',
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'edit',
            onClick: () => onEdit(),
            label: 'Редактировать',
          },
          {
            key: 'archive',
            onClick: () => onArchive(),
            label: archiveLabel,
          },
          {
            key: 'delete',
            label: 'Удалить',
            onClick: () => onDelete(),
            danger: true,
          },
        ],
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <MoreOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
    </Dropdown>
  );
};

export default ActionMenu;
