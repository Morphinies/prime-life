import { useEffect, useState } from 'react';
import ModalFooter from '@/shared/ui/ModalFooter';
import type { TaskEdit } from '@/entities/task';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { Fieldset, type FieldsetProps } from '@/shared/ui/Fieldset';
import { Alert, Button, Form, Modal, Tooltip, type FormProps, type ModalProps } from 'antd';
import Icon from '@/shared/ui/Icon';

type ModalTaskFieldSet = FieldsetProps;

function normalizeTaskFormValues(values: Record<string, unknown>): TaskEdit {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      const normalizedValue = Array.isArray(value) ? value[0] : value;

      if (key === 'project' && !normalizedValue) {
        return [key, null];
      }

      return [key, normalizedValue];
    })
  ) as TaskEdit;
}

export interface ModalTaskProps {
  error?: string;
  form?: FormProps;
  taskEdit?: TaskEdit | null;
  fields?: FieldsetProps['fields'];
  fieldSets?: ModalTaskFieldSet[];
  handleArchive?: (task: TaskEdit) => void;
  handleDelete?: (task: TaskEdit) => void;
  handleSubmit: (task: TaskEdit) => void;
  modal: ModalProps & { toggle?: (v: boolean) => void };
}

const ModalTask = ({
  error,
  modal,
  fields,
  taskEdit,
  fieldSets,
  handleArchive,
  handleDelete,
  handleSubmit,
  form: formProps,
}: ModalTaskProps) => {
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
    if (taskEdit) {
      form.setFieldsValue({
        ...taskEdit,
        project: taskEdit.project ? [taskEdit.project] : undefined,
      });
    }
  }, [form, taskEdit]);

  const submitLabel = taskEdit?.id ? 'Обновить' : 'Добавить';
  const title = taskEdit?.id ? 'Редактировать задачу' : 'Добавить задачу';
  const preparedFieldSets = fieldSets || (fields ? [{ fields }] : []);
  const formId = 'task-form';

  const handleFinish = () => {
    handleSubmit({
      ...taskEdit,
      ...normalizeTaskFormValues(form.getFieldsValue()),
    });
  };

  const titleActions = (
    <div className="modal-title-actions">
      {taskEdit?.id && handleArchive && (
        <Tooltip title={taskEdit.isArchived ? 'Разархивировать' : 'Архивировать'}>
          <Button
            type="text"
            className="modal-title-action-button"
            icon={<Icon name={taskEdit.isArchived ? 'UndoOutlined' : 'InboxOutlined'} />}
            onClick={() => handleArchive(taskEdit)}
          />
        </Tooltip>
      )}

      {taskEdit?.id && handleDelete && (
        <Tooltip title="Удалить">
          <Button
            danger
            type="text"
            className="modal-title-action-button"
            icon={<Icon name="DeleteOutlined" />}
            onClick={() => handleDelete(taskEdit)}
          />
        </Tooltip>
      )}
    </div>
  );

  return (
    <Modal
      title={title}
      okButtonProps={{
        children: submitLabel,
      }}
      styles={{
        container: { paddingTop: cssVar.sizeXXL },
        header: { paddingRight: taskEdit?.id ? 112 : undefined },
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
        name="basic"
        autoComplete="off"
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        {...formProps}
      >
        {preparedFieldSets.map(({ fields, ...config }, index) => (
          <Fieldset key={index} fields={fields} {...config} />
        ))}
      </Form>
      {error && <Alert title={error} type="error" showIcon />}
    </Modal>
  );
};

export default ModalTask;
