import { useEffect, useState } from 'react';
import { Alert, Form, Modal, type FormProps, type ModalProps } from 'antd';
import type { ProjectEdit } from '@/entities/project';
import { Fieldset, type FieldsetProps } from '@/shared/ui/Fieldset';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import ModalFooter from '@/shared/ui/ModalFooter';

export interface ModalProjectProps {
  error?: string;
  form?: FormProps;
  projectEdit?: ProjectEdit | null;
  fields: FieldsetProps['fields'];
  handleSubmit: (project: ProjectEdit) => void;
  modal: ModalProps & { toggle?: (v: boolean) => void };
}

const ModalProject = ({
  error,
  modal,
  fields,
  projectEdit,
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

  return (
    <Modal
      title={title}
      okButtonProps={{
        children: submitLabel,
      }}
      styles={{
        container: { paddingTop: cssVar.sizeXXL },
      }}
      closable={{ 'aria-label': 'Закрыть' }}
      footer={
        <ModalFooter
          buttons={[
            {
              type: 'primary',
              disabled: !isValid,
              children: submitLabel,
              onClick: () =>
                handleSubmit({
                  ...projectEdit,
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
        name="project"
        autoComplete="off"
        initialValues={{ remember: true }}
        {...formProps}
      >
        <Fieldset fields={fields} />
      </Form>
      {error && <Alert title={error} type="error" showIcon />}
    </Modal>
  );
};

export default ModalProject;
