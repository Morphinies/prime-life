import * as Icons from '@ant-design/icons';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export type IconName = Extract<keyof typeof Icons, `${string}${'Outlined' | 'Filled' | 'TwoTone'}`>;

export interface IconProps extends Omit<AntdIconProps, 'ref'> {
  name: IconName;
}

const Icon = ({ name, color, ...restProps }: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Иконка "${name}" не найдена`);
    return null;
  }

  return <IconComponent {...restProps} style={{ color }} />;
};

export default Icon;
