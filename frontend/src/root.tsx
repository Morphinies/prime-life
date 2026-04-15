import {
  Link,
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';
import React from 'react';
import 'antd/dist/reset.css';
import '@/app/styles/global.css';
import { Button, Result } from 'antd';
import type { Route } from './+types/root';
import { AppProviders } from './app/providers';
import RootLayout from '@/widgets/Layouts/rootLayout';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProviders>
          <RootLayout>{children}</RootLayout>
        </AppProviders>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Result
      title="404"
      status="404"
      subTitle="Извините, страница, которую вы ищете, не существует."
      extra={
        <Link to={'/'}>
          <Button type="primary">Вернуться на главную</Button>
        </Link>
      }
    />
  );
}

export default function Root() {
  return <Outlet />;
}
