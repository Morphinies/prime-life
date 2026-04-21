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
    ALLOWED_ORIGINS: zod_1.z.preprocess((val) => {
        if (typeof val === 'string') {
            if (val.trim().startsWith('['))
                return JSON.parse(val);
            else
                return val.trim();
        }
    }, zod_1.z.string().or(zod_1.z.array(zod_1.z.string()))),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.coerce.number(),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
});
exports.env = envSchema.parse(process_1.default.env);
