import {
  Flex,
  Form,
  Input,
  Select,
  DatePicker,
  type FlexProps,
  type SelectProps,
  type FormItemProps,
} from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;

export interface FieldProps extends FormItemProps {
  name: string;
  placeholder?: string;
  options?: SelectProps['options'];
  creatable?: boolean;
  type?: 'input' | 'textarea' | 'select' | 'date';
}

export interface FieldsetProps extends Pick<FlexProps, 'vertical'> {
  fields: FieldProps[];
}

export function Fieldset({ fields, vertical = true }: FieldsetProps) {
  return (
    <Flex vertical={vertical} gap={vertical ? undefined : 'medium'}>
      {fields.map(({ name, label, type = 'input', placeholder, options, creatable, ...rest }) => {
        const inputProps = { placeholder };

        const getValueProps = (value: any) => {
          if (type === 'date' && value && typeof value === 'string') {
            return { value: dayjs(value) };
          }
          return { value };
        };

        return (
          <Form.Item
            style={{ flex: vertical ? undefined : 1 }}
            key={name}
            name={name}
            label={label}
            getValueProps={getValueProps}
            {...rest}
          >
            {type === 'input' && <Input {...inputProps} />}
            {type === 'textarea' && (
              <TextArea rows={12} styles={{ textarea: { resize: 'none' } }} {...inputProps} />
            )}
            {type === 'select' && (
              <Select
                options={options}
                allowClear
                showSearch={creatable}
                optionFilterProp="label"
                mode={creatable ? 'tags' : undefined}
                maxCount={creatable ? 1 : undefined}
                {...inputProps}
              />
            )}
            {type === 'date' && <DatePicker style={{ width: '100%' }} {...inputProps} />}
          </Form.Item>
        );
      })}
    </Flex>
  );
}
