import { useEffect, useState } from 'react';
import ModalFooter from '@/shared/ui/ModalFooter';
import type { TaskEdit } from '@/entities/task';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { Fieldset, type FieldsetProps } from '@/shared/ui/Fieldset';
import { Alert, Form, Modal, type FormProps, type ModalProps } from 'antd';

type ModalTaskFieldSet = FieldsetProps;

export interface ModalTaskProps {
  error?: string;
  form?: FormProps;
  taskEdit?: TaskEdit | null;
  fields?: FieldsetProps['fields'];
  fieldSets?: ModalTaskFieldSet[];
  handleSubmit: (task: TaskEdit) => void;
  modal: ModalProps & { toggle?: (v: boolean) => void };
}

const ModalTask = ({
  error,
  modal,
  fields,
  taskEdit,
  fieldSets,
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

  const submitLabel = taskEdit?.id ? 'Обновить' : 'Добавить';
  const preparedFieldSets = fieldSets || (fields ? [{ fields }] : []);

  return (
    <Modal
      okButtonProps={{
        children: submitLabel,
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
              children: submitLabel,
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
        {preparedFieldSets.map(({ fields, ...config }, index) => (
          <Fieldset key={index} fields={fields} {...config} />
        ))}
      </Form>
      {error && <Alert title={error} type="error" showIcon />}
    </Modal>
  );
};

export default ModalTask;
