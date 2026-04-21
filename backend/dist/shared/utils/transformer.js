"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCase = toSnakeCase;
exports.toCamelCase = toCamelCase;
// camelCase to snake_case
function toSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
}
//  snake_case to camelCase
function toCamelCase(str) {
    return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
