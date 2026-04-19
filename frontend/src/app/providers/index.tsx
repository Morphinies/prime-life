import { store } from '@/app/store';
import { AntdProvider } from './AntdProvider';
import { Preloader } from '@/widgets/Preloader';
import { Provider as ReduxProvider } from 'react-redux';
import { queryClient } from '@/shared/api/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Preloader />
        <AntdProvider>{children}</AntdProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
};
