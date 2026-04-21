import { Link } from 'react-router';
import { Flex, Typography } from 'antd';
import { useThemeMode } from '@/features/theme';
import { useThemeToken } from '@/shared/lib/hooks/useThemeToken';
import { ReactComponent as LogoDark } from '@/assets/icons/logo-dark.svg';
import { ReactComponent as LogoLight } from '@/assets/icons/logo-light.svg';

interface LogoProps {
  collapsed: boolean;
}

const Logo = ({ collapsed }: LogoProps) => {
  const { token } = useThemeToken();
  const { isDarkTheme } = useThemeMode();

  return (
    <Link to={'/'}>
      <Flex
        gap="small"
        align="center"
        justify="flex-start"
        style={{
          width: collapsed ? 80 : 200,
          paddingLeft: token.paddingLG,
          transition: `width ${token.motionDurationMid} ${token.motionEaseInOut}`,
        }}
      >
        {isDarkTheme ? (
          <LogoLight
            style={{
              width: '2rem',
              height: '2rem',
              flexShrink: 0,
            }}
          />
        ) : (
          <LogoDark
            style={{
              width: '2rem',
              height: '2rem',
              flexShrink: 0,
            }}
          />
        )}

        <Typography.Text
          strong
          style={{
            fontSize: 16,
            whiteSpace: 'nowrap',
            opacity: collapsed ? 0 : 1,
            transition: `opacity ${token.motionDurationMid} ${token.motionEaseInOut}`,
          }}
        >
          PrimeLife
        </Typography.Text>
      </Flex>
    </Link>
  );
};

export default Logo;
