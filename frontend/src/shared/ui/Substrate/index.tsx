import type { ReactNode } from 'react';
import type { Size } from '@/shared/types';
import { Flex, type FlexProps } from 'antd';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';

interface SubstrateProps extends FlexProps {
  padding?: Size;
  full?: boolean;
  children: ReactNode;
  fullHeight?: boolean;
}

const Substrate = ({
  full,
  padding,
  children,
  fullHeight,
  style = {},
  ...rest
}: SubstrateProps) => {
  const { token } = useThemeToken();

  return (
    <Flex
      vertical
      style={{
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        width: full ? 'auto' : 'fit-content',
        height: fullHeight ? '100%' : undefined,
        padding: token[`padding${padding || 'MD'}`],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Substrate;
