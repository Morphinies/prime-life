"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const router_factory_1 = require("./router-factory");
const auth_routes_1 = __importDefault(require("../../modules/auth/auth.routes"));
exports.router = new router_factory_1.Router('/', [auth_routes_1.default]);
exports.default = exports.router;
