"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router_factory_1 = require("../../core/router/router-factory");
const authRouter = new router_factory_1.Router('/auth');
authRouter.addRoute('GET', '/login', auth_controller_1.default.login);
exports.default = authRouter;
