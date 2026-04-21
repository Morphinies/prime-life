"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = void 0;
const bodyParser = async () => {
    return async ({ req, res }) => {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const contentType = req.headers['content-type'] || '';
                    // Парсим JSON
                    if (contentType.includes('application/json')) {
                        req.body = body ? JSON.parse(body) : {};
                    }
                    // Парсим URL-encoded формы
                    else if (contentType.includes('application/x-www-form-urlencoded')) {
                        const params = new URLSearchParams(body);
                        req.body = Object.fromEntries(params);
                    }
                    // Multipart/form-data (простейший вариант)
                    else if (contentType.includes('multipart/form-data')) {
                        req.body = {};
                    }
                    // Текстовый plain
                    else {
                        req.body = body;
                    }
                    resolve(req.body);
                }
                catch (err) {
                    req.body = {};
                    reject(err);
                }
            });
            req.on('error', (err) => {
                reject(err);
            });
        });
    };
};
exports.bodyParser = bodyParser;
