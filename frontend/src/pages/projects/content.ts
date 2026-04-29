import type { HeadControllerConfigProps } from './ui/HeadController';
import type { ModalProjectProps } from './ui/ModalProject';

const content: {
  modalProject: Pick<ModalProjectProps, 'fields'>;
  headController: Omit<HeadControllerConfigProps, 'projectFilters' | 'title'>;
} = {
  headController: {
    viewSettings: [{ label: 'Список', value: 'list', iconName: 'BarsOutlined' }],
  },
  modalProject: {
    fields: [
      {
        name: 'title',
        placeholder: 'Название проекта',
        rules: [{ required: true, message: 'Пожалуйста, укажите название проекта' }],
      },
      {
        type: 'textarea',
        name: 'description',
        placeholder: 'Описание проекта',
      },
    ],
  },
};

export default content;
