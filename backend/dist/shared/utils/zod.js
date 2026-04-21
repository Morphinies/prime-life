"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullToUndefined = void 0;
const nullToUndefined = (schema) => schema.nullable().transform((v) => v ?? undefined);
exports.nullToUndefined = nullToUndefined;
