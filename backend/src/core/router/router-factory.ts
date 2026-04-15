import { parseUrl } from '@/shared/utils/index.js';
import { HTTPRequest, HTTPResponse } from '@/types/index.js';
import { Route, RouteHandlerProps, RouteMiddleware } from './router.types.js';
import { bodyParser } from '../middleware/bodyParser.js';
import jsonResponseMiddleware from '../middleware/jsonResponse.js';
import z from 'zod';

type InternalRoute = Route & {
  _normalizedPath: string;
  _segments: number;
  _hasWildcard: boolean;
  _weight: number;
};

export class Router {
  private routes: InternalRoute[] = [];
  private routesByMethod: Map<string, InternalRoute[]> = new Map();
  private beforeMiddlewares: RouteMiddleware[] = [];
  private afterMiddlewares: RouteMiddleware[] = [];
  public basePath = '/';

  constructor(basePath?: string, subRouters?: Router[]) {
    if (basePath) this.basePath = this.normalizePath(basePath);

    if (subRouters?.length) {
      subRouters.forEach((router) => this.addRouter(router));
    }
  }

  public use(middleware: RouteMiddleware) {
    this.beforeMiddlewares.push(middleware);
  }

  public useAfter(middleware: RouteMiddleware) {
    this.afterMiddlewares.push(middleware);
  }

  private normalizePath(path: string): string {
    let normalized = path.trim();
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized || '/';
  }

  private joinPaths(basePath: string, routePath: string): string {
    const normalizedBase = this.normalizePath(basePath);
    const normalizedRoute = this.normalizePath(routePath);

    if (normalizedBase === '/') {
      return normalizedRoute;
    }
    if (normalizedRoute === '/') {
      return normalizedBase;
    }

    return this.normalizePath(`${normalizedBase}/${normalizedRoute.replace(/^\//, '')}`);
  }

  private getRouteWeight(path: string, exact?: boolean): number {
    const hasWildcard = path.includes('*');
    const hasParam = path.includes(':');
    const segments = this.splitPath(path).length;

    let weight = 0;
    if (exact) weight += 100;
    if (hasWildcard) weight += 50;
    if (hasParam) weight += 20;
    weight += segments;

    return weight;
  }

  private splitPath(path: string): string[] {
    const normalized = this.normalizePath(path);
    if (normalized === '/') return [];
    return normalized.slice(1).split('/').filter(Boolean);
  }

  private buildRoute(
    method: string,
    path: string,
    handler: Route['handler'],
    options?: Route['options']
  ): InternalRoute {
    const normalizedPath = this.normalizePath(path);
    const exact = Boolean(options?.exact);
    const route: InternalRoute = {
      method: method as Route['method'],
      path: normalizedPath,
      handler,
      options,
      _normalizedPath: normalizedPath,
      _segments: this.splitPath(normalizedPath).length,
      _hasWildcard: normalizedPath.includes('*'),
      _weight: this.getRouteWeight(normalizedPath, exact),
    };

    return route;
  }

  public addRoute(
    method: Route['method'] = 'GET',
    path: Route['path'],
    handler: Route['handler'],
    options?: Route['options']
  ) {
    const normalizedMethod = (method || 'GET').toUpperCase();
    const route = this.buildRoute(normalizedMethod, path, handler, options);

    this.routes.push(route);

    const routesForMethod = this.routesByMethod.get(normalizedMethod) || [];
    routesForMethod.push(route);
    routesForMethod.sort((a, b) => b._weight - a._weight);
    this.routesByMethod.set(normalizedMethod, routesForMethod);
  }

  private addRouter(router: Router) {
    const routerBase = this.normalizePath(router.basePath);

    router.routes.forEach((route) => {
      const fullPath = this.joinPaths(routerBase, route._normalizedPath);
      this.addRoute(route.method || 'GET', fullPath, route.handler, route.options);
    });
  }

  private matchRoute(
    pathname: string,
    route: InternalRoute,
    exact: boolean
  ): { matched: boolean; params: Record<string, string> } {
    const urlSegments = this.splitPath(pathname);
    const routeSegments = this.splitPath(route._normalizedPath);
    const params: Record<string, string> = {};

    for (let idx = 0; idx < routeSegments.length; idx++) {
      const routeSegment = routeSegments[idx];
      if (routeSegment === '*') {
        params['wildcard'] = urlSegments.slice(idx).map(decodeURIComponent).join('/');
        return { matched: true, params };
      }

      if (idx >= urlSegments.length) {
        return { matched: false, params: {} };
      }

      const urlSegment = urlSegments[idx];

      if (routeSegment.startsWith(':')) {
        const key = routeSegment.slice(1);
        params[key] = decodeURIComponent(urlSegment);
        continue;
      }

      if (routeSegment !== urlSegment) {
        return { matched: false, params: {} };
      }
    }

    if (exact) {
      if (urlSegments.length !== routeSegments.length) {
        return { matched: false, params: {} };
      }
      return { matched: true, params };
    }

    // prefix matching for non-exact routes
    if (urlSegments.length < routeSegments.length) {
      return { matched: false, params: {} };
    }

    return { matched: true, params };
  }

  private executeMiddlewares(
    middlewares: RouteMiddleware[],
    props: RouteHandlerProps,
    res: HTTPResponse
  ): boolean {
    for (const middleware of middlewares) {
      middleware(props);
      if (res.writableEnded) {
        return false;
      }
    }
    return true;
  }

  private findRouteMatch(
    method: string,
    pathname: string
  ): { route: InternalRoute | null; params: Record<string, string> } {
    const candidates = this.routesByMethod.get(method) || [];

    // exact routes first
    for (const route of candidates.filter((r) => r.options?.exact)) {
      const result = this.matchRoute(pathname, route, true);
      if (result.matched) {
        return { route, params: result.params };
      }
    }

    // prefix / params / wildcard routes next
    for (const route of candidates.filter((r) => !r.options?.exact)) {
      const result = this.matchRoute(pathname, route, false);
      if (result.matched) {
        return { route, params: result.params };
      }
    }

    return { route: null, params: {} };
  }

  public async handleRequest(req: HTTPRequest, res: HTTPResponse) {
    jsonResponseMiddleware({ req, res });

    const method = (req.method || 'GET').toUpperCase();
    const url = req.url;

    if (!url) {
      res.json('Invalid request URL', 400);
      return;
    }

    const { pathname, query } = parseUrl(url, req);
    if (!pathname) {
      res.json('Invalid request path', 400);
      return;
    }

    const { route, params } = this.findRouteMatch(method, pathname);

    if (!route) {
      res.json('Page is not found', 404);
      return;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        await (
          await bodyParser()
        )({ req, res });
      } catch (err) {
        res.json({ error: 'Invalid request body' }, 400);
        return;
      }
    }

    const props: RouteHandlerProps = { req, res, params, query };

    if (!this.executeMiddlewares(this.beforeMiddlewares, props, res)) {
      return;
    }

    if (
      route.options?.middleware &&
      !this.executeMiddlewares(route.options.middleware, props, res)
    ) {
      return;
    }

    try {
      await route.handler(props);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.json({ error: JSON.parse(err.message || '{}') }, 400);
      } else if (err instanceof Error) {
        const errorMessage = err?.message;
        res.json({ error: errorMessage ?? 'Internal server error' }, 500);
      } else {
        res.json({ error: 'Internal server error' }, 500);
      }
    }

    if (res.writableEnded) {
      return;
    }

    this.executeMiddlewares(this.afterMiddlewares, props, res);
  }
}
