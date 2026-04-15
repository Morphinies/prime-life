import fs from 'fs';
import path from 'path';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import { HTTPRequest, HTTPResponse } from '@/types';

export default function swagger(req: HTTPRequest, res: HTTPResponse) {
  const swaggerUiPath = getAbsoluteFSPath();

  // HTML страница
  if (req.url === '/docs') {
    const indexPath = path.join(swaggerUiPath, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return true;
  }

  // swagger-initializer.js - содержит конфигурацию
  if (req.url === '/swagger-initializer.js') {
    const initPath = path.join(swaggerUiPath, 'swagger-initializer.js');
    let js = fs.readFileSync(initPath, 'utf8');

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
  const filePath = path.join(swaggerUiPath, fileName || '');

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentTypes: Record<string, string> = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
      '.map': 'application/json',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    return true;
  }

  return false;
}
