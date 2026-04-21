"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsonResponseMiddleware;
function jsonResponseMiddleware({ res }) {
    res.json = (data, statusCode = 200) => {
        res.writeHead(statusCode, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data));
    };
}
