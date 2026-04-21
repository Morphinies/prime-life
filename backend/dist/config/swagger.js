"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = swagger;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_ui_dist_1 = require("swagger-ui-dist");
function swagger(req, res) {
    const swaggerUiPath = (0, swagger_ui_dist_1.getAbsoluteFSPath)();
    // HTML страница
    if (req.url === '/docs') {
        const indexPath = path_1.default.join(swaggerUiPath, 'index.html');
        let html = fs_1.default.readFileSync(indexPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return true;
    }
    // swagger-initializer.js - содержит конфигурацию
    if (req.url === '/swagger-initializer.js') {
        const initPath = path_1.default.join(swaggerUiPath, 'swagger-initializer.js');
        let js = fs_1.default.readFileSync(initPath, 'utf8');
        // Заменяем URL спецификации на ваш
        js = js.replace('https://petstore.swagger.io/v2/swagger.json', '/openapi.json');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(js);
        return true;
    }
    // OpenAPI спецификация
    if (req.url === '/openapi.json') {
        const spec = require('../openapi.json');
        res.json(spec);
        return true;
    }
    // Обработка статических файлов (css, js, png и т.д.)
    const fileName = req.url?.replace(/^\.\//, ''); // убираем ./ если есть
    const filePath = path_1.default.join(swaggerUiPath, fileName || '');
    if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isFile()) {
        const ext = path_1.default.extname(filePath);
        const contentTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.ico': 'image/x-icon',
            '.map': 'application/json',
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        const content = fs_1.default.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return true;
    }
    return false;
}
