"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const index_js_1 = require("../../shared/utils/index.js");
const bodyParser_js_1 = require("../middleware/bodyParser.js");
const jsonResponse_js_1 = __importDefault(require("../middleware/jsonResponse.js"));
const zod_1 = __importDefault(require("zod"));
class Router {
    routes = [];
    routesByMethod = new Map();
    beforeMiddlewares = [];
    afterMiddlewares = [];
    basePath = '/';
    constructor(basePath, subRouters) {
        if (basePath)
            this.basePath = this.normalizePath(basePath);
        if (subRouters?.length) {
            subRouters.forEach((router) => this.addRouter(router));
        }
    }
    use(middleware) {
        this.beforeMiddlewares.push(middleware);
    }
    useAfter(middleware) {
        this.afterMiddlewares.push(middleware);
    }
    normalizePath(path) {
        let normalized = path.trim();
        if (!normalized.startsWith('/')) {
            normalized = '/' + normalized;
        }
        if (normalized.length > 1 && normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized || '/';
    }
    joinPaths(basePath, routePath) {
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
    getRouteWeight(path, exact) {
        const hasWildcard = path.includes('*');
        const hasParam = path.includes(':');
        const segments = this.splitPath(path).length;
        let weight = 0;
        if (exact)
            weight += 100;
        if (hasWildcard)
            weight += 50;
        if (hasParam)
            weight += 20;
        weight += segments;
        return weight;
    }
    splitPath(path) {
        const normalized = this.normalizePath(path);
        if (normalized === '/')
            return [];
        return normalized.slice(1).split('/').filter(Boolean);
    }
    buildRoute(method, path, handler, options) {
        const normalizedPath = this.normalizePath(path);
        const exact = Boolean(options?.exact);
        const route = {
            method: method,
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
    addRoute(method = 'GET', path, handler, options) {
        const normalizedMethod = (method || 'GET').toUpperCase();
        const route = this.buildRoute(normalizedMethod, path, handler, options);
        this.routes.push(route);
        const routesForMethod = this.routesByMethod.get(normalizedMethod) || [];
        routesForMethod.push(route);
        routesForMethod.sort((a, b) => b._weight - a._weight);
        this.routesByMethod.set(normalizedMethod, routesForMethod);
    }
    addRouter(router) {
        const routerBase = this.normalizePath(router.basePath);
        router.routes.forEach((route) => {
            const fullPath = this.joinPaths(routerBase, route._normalizedPath);
            this.addRoute(route.method || 'GET', fullPath, route.handler, route.options);
        });
    }
    matchRoute(pathname, route, exact) {
        const urlSegments = this.splitPath(pathname);
        const routeSegments = this.splitPath(route._normalizedPath);
        const params = {};
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
    executeMiddlewares(middlewares, props, res) {
        for (const middleware of middlewares) {
            middleware(props);
            if (res.writableEnded) {
                return false;
            }
        }
        return true;
    }
    findRouteMatch(method, pathname) {
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
    async handleRequest(req, res) {
        (0, jsonResponse_js_1.default)({ req, res });
        const method = (req.method || 'GET').toUpperCase();
        const url = req.url;
        if (!url) {
            res.json('Invalid request URL', 400);
            return;
        }
        const { pathname, query } = (0, index_js_1.parseUrl)(url, req);
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
                await (await (0, bodyParser_js_1.bodyParser)())({ req, res });
            }
            catch (err) {
                res.json({ error: 'Invalid request body' }, 400);
                return;
            }
        }
        const props = { req, res, params, query };
        if (!this.executeMiddlewares(this.beforeMiddlewares, props, res)) {
            return;
        }
        if (route.options?.middleware &&
            !this.executeMiddlewares(route.options.middleware, props, res)) {
            return;
        }
        try {
            await route.handler(props);
        }
        catch (err) {
            if (err instanceof zod_1.default.ZodError) {
                res.json({ error: JSON.parse(err.message || '{}') }, 400);
            }
            else if (err instanceof Error) {
                const errorMessage = err?.message;
                res.json({ error: errorMessage ?? 'Internal server error' }, 500);
            }
            else {
                res.json({ error: 'Internal server error' }, 500);
            }
        }
        if (res.writableEnded) {
            return;
        }
        this.executeMiddlewares(this.afterMiddlewares, props, res);
    }
}
exports.Router = Router;
