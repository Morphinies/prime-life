import http from 'http';

export function parseUrl(url: string, req: http.IncomingMessage) {
  const urlObj = new URL(url, `http://${req.headers.host}`);
  return {
    pathname: urlObj.pathname,
    query: Object.fromEntries(urlObj.searchParams),
  };
}
