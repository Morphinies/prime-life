import { IncomingMessage, ServerResponse } from 'http';

export type HTTPRequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface HTTPRequest extends IncomingMessage {
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

export interface HTTPResponse extends ServerResponse {}
