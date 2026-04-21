import type { GlobalToken } from 'antd';

export const COLORS = {
  red: 'red',
  volcano: 'volcano',
  orange: 'orange',
  gold: 'gold',
  yellow: 'yellow',
  lime: 'lime',
  green: 'green',
  cyan: 'cyan',
  blue: 'blue',
  geekblue: 'geekblue',
  purple: 'purple',
  magenta: 'magenta',
} as const satisfies Partial<GlobalToken>;

export type Color = keyof typeof COLORS;
