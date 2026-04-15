import { HTTPRequest, HTTPRequestMethod, HTTPResponse } from '@/types';

export type RouteMiddleware = (props: RouteHandlerProps) => void;

export type Route = {
  path: string;
  method?: HTTPRequestMethod;
  handler: (props: RouteHandlerProps) => void;
  options?: {
    exact?: boolean;
    middleware?: RouteMiddleware[];
  };
};

export type RouteHandlerProps = {
  req: HTTPRequest;
  res: HTTPResponse;
  params?: Record<string, string>;
  query?: Record<string, string>;
};
