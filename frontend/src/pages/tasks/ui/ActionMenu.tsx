import React from 'react';
import { Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

interface ActionMenuProps {
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onArchive, onDelete }) => {
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
            label: 'Архивировать',
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
