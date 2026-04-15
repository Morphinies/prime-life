import { HTTPRequest, HTTPResponse } from '@/types';

declare module 'http' {
  interface ServerResponse {
    json: (data: any, statusCode?: number) => void;
  }
}

export default function jsonResponseMiddleware({ res }: { req: HTTPRequest; res: HTTPResponse }) {
  res.json = (data: any, statusCode: number = 200) => {
    res.writeHead(statusCode, { 'content-type': 'application/json' });
    res.end(JSON.stringify(data));
  };
}
