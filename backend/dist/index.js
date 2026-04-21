"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const router_1 = __importDefault(require("./core/router"));
const swagger_1 = __importDefault(require("./config/swagger"));
const init_1 = require("./core/database/init");
const cors_1 = require("./core/middleware/cors");
const cors_2 = require("./config/cors");
async function startServer() {
    await (0, init_1.initDatabase)();
    const server = http_1.default.createServer((req, res) => {
        // const referer = req.headers.referer || req.headers.referrer;
        const corsResult = (0, cors_1.corsMiddleware)(cors_2.corsConfig)({ req, res });
        if (req.method === 'OPTIONS' || !corsResult)
            return;
        const isHandled = (0, swagger_1.default)(req, res);
        if (!isHandled) {
            router_1.default.handleRequest(req, res);
        }
    });
    server.listen(env_1.env.PORT, () => {
        console.log(`The server was started on ${env_1.env.PORT} port`);
    });
}
startServer();
