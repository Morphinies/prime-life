"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const router_1 = __importDefault(require("./core/router"));
const server = http_1.default.createServer((req, res) => {
    router_1.default.handleRequest(req, res);
});
server.listen(env_1.env.PORT, () => {
    console.log(`The server was started on ${env_1.env.PORT} port`);
});
