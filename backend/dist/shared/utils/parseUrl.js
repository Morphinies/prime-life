"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = parseUrl;
function parseUrl(url, req) {
    const urlObj = new URL(url, `http://${req.headers.host}`);
    return {
        pathname: urlObj.pathname,
        query: Object.fromEntries(urlObj.searchParams),
    };
}
