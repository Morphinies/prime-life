"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    login = async ({ res }) => {
        const data = await this.authService.login();
        res.json(data);
    };
}
exports.AuthController = AuthController;
const authController = new AuthController();
exports.default = authController;
