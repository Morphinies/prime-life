import { useEffect, useState } from 'react';
import type { TaskEdit } from '@/shared/ui/Task';
import ModalFooter from '@/shared/ui/ModalFooter';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { Fieldset, type FieldsetProps } from '@/shared/ui/Fieldset';
import { Alert, Form, Modal, type FormProps, type ModalProps } from 'antd';

export interface ModalTaskProps {
  error?: string;
  form?: FormProps;
  taskEdit?: TaskEdit | null;
  fields: FieldsetProps['fields'];
  bottomFields: FieldsetProps['fields'];
  handleSubmit: (task: TaskEdit) => void;
  modal: ModalProps & { toggle?: (v: boolean) => void };
}

const ModalTask = ({
  error,
  modal,
  fields,
  taskEdit,
  bottomFields,
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
      form.setFieldsValue(taskEdit);
    }
  }, [form, taskEdit]);

  return (
    <Modal
      okButtonProps={{
        children: taskEdit?.id ? 'Обновить' : 'Добавить',
      }}
      styles={{
        container: { paddingTop: cssVar.sizeXXL },
      }}
      closable={{ 'aria-label': 'Custom Close Button' }}
      footer={
        <ModalFooter
          buttons={[
            {
              type: 'primary',
              disabled: !isValid,
              children: taskEdit?.id ? 'Обновить' : 'Добавить',
              onClick: () =>
                handleSubmit({
                  ...taskEdit,
                  ...form.getFieldsValue(),
                }),
            },
          ]}
        />
      }
      {...modal}
    >
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        initialValues={{ remember: true }}
        {...formProps}
      >
        <Fieldset fields={fields} />
        <Fieldset fields={bottomFields} vertical={false} />
      </Form>
      {error && <Alert title={error} type="error" showIcon />}
    </Modal>
  );
};

export default ModalTask;
