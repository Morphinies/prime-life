"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const process_1 = __importDefault(require("process"));
dotenv_1.default.config({
    path: path_1.default.resolve('../.env'),
});
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    CLIENT_PORT: zod_1.z.coerce.number(),
});
exports.env = envSchema.parse(process_1.default.env);
