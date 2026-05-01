import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Tooltip, type FormProps, type ModalProps } from 'antd';
import type { ProjectEdit } from '@/entities/project';
import { Fieldset, type FieldsetProps } from '@/shared/ui/Fieldset';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import ModalFooter from '@/shared/ui/ModalFooter';
import Icon from '@/shared/ui/Icon';

export interface ModalProjectProps {
  error?: string;
  form?: FormProps;
  projectEdit?: ProjectEdit | null;
  fields: FieldsetProps['fields'];
  handleArchive?: (project: ProjectEdit) => void;
  handleDelete?: (project: ProjectEdit) => void;
  handleSubmit: (project: ProjectEdit) => void;
  modal: ModalProps & { toggle?: (v: boolean) => void };
}

const ModalProject = ({
  error,
  modal,
  fields,
  projectEdit,
  handleArchive,
  handleDelete,
  handleSubmit,
  form: formProps,
}: ModalProjectProps) => {
  const { cssVar } = useThemeToken();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, [form, values]);

  useEffect(() => {
    if (projectEdit) {
      form.setFieldsValue(projectEdit);
    } else {
      form.resetFields();
    }
  }, [form, projectEdit]);

  const submitLabel = projectEdit?.id ? 'Обновить' : 'Добавить';
  const title = projectEdit?.id ? 'Редактировать проект' : 'Добавить проект';
  const formId = 'project-form';
  const titleActions = (
    <div className="modal-title-actions">
      {projectEdit?.id && handleArchive && (
        <Tooltip title={projectEdit.isArchived ? 'Разархивировать' : 'Архивировать'}>
          <Button
            type="text"
            className="modal-title-action-button"
            icon={<Icon name={projectEdit.isArchived ? 'UndoOutlined' : 'InboxOutlined'} />}
            onClick={() => handleArchive(projectEdit)}
          />
        </Tooltip>
      )}

      {projectEdit?.id && handleDelete && (
        <Tooltip title="Удалить">
          <Button
            danger
            type="text"
            className="modal-title-action-button"
            icon={<Icon name="DeleteOutlined" />}
            onClick={() => handleDelete(projectEdit)}
          />
        </Tooltip>
      )}
    </div>
  );

  const handleFinish = () => {
    handleSubmit({
      ...projectEdit,
      ...form.getFieldsValue(),
    });
  };

  return (
    <Modal
      title={title}
      okButtonProps={{
        children: submitLabel,
      }}
      styles={{
        container: { paddingTop: cssVar.sizeXXL },
        header: { paddingRight: projectEdit?.id ? 112 : undefined },
      }}
      closable={{ 'aria-label': 'Закрыть' }}
      footer={
        <ModalFooter
          buttons={[
            {
              type: 'primary',
              htmlType: 'submit',
              form: formId,
              disabled: !isValid,
              children: submitLabel,
            },
          ]}
        />
      }
      {...modal}
    >
      {titleActions}
      <Form
        id={formId}
        form={form}
        name="project"
        autoComplete="off"
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        {...formProps}
      >
        <Fieldset fields={fields} />
      </Form>
      {error && <Alert title={error} type="error" showIcon />}
    </Modal>
  );
};

export default ModalProject;
