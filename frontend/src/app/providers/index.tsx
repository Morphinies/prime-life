import { store } from '@/app/store';
import { AntdProvider } from './AntdProvider';
import { Preloader } from '@/widgets/Preloader';
import { Provider as ReduxProvider } from 'react-redux';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <Preloader />
      <AntdProvider>{children}</AntdProvider>
    </ReduxProvider>
  );
};
