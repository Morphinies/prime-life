"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const defaultOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [],
    credentials: false,
    maxAge: 86400, // 24 часа
};
const corsMiddleware = (options = {}) => {
    const opts = { ...defaultOptions, ...options };
    return ({ req, res }) => {
        const requestOrigin = req.headers.origin;
        // Проверяем разрешен ли origin
        let allowOrigin = '*';
        if (opts.origin && opts.origin !== '*') {
            if (Array.isArray(opts.origin)) {
                if (requestOrigin && opts.origin.includes(requestOrigin)) {
                    allowOrigin = requestOrigin;
                }
                else {
                    allowOrigin = '';
                }
            }
            else if (typeof opts.origin === 'string') {
                allowOrigin = opts.origin;
            }
        }
        // Устанавливаем CORS заголовки
        if (allowOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowOrigin);
        }
        res.setHeader('Access-Control-Allow-Methods', opts.methods.join(','));
        res.setHeader('Access-Control-Allow-Headers', opts.allowedHeaders.join(','));
        if (opts.exposedHeaders?.length) {
            res.setHeader('Access-Control-Expose-Headers', opts.exposedHeaders.join(','));
        }
        if (opts.credentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        if (opts.maxAge) {
            res.setHeader('Access-Control-Max-Age', opts.maxAge.toString());
        }
        // Обработка preflight запросов (OPTIONS)
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return false; // Прерываем дальнейшую обработку
        }
        return true; // Продолжаем обработку
    };
};
exports.corsMiddleware = corsMiddleware;
