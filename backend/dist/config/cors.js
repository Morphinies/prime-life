"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const env_1 = require("./env");
exports.corsConfig = {
    origin: env_1.env.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit'],
    credentials: true,
    maxAge: 86400,
};
