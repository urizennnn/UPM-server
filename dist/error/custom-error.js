"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomAPIErrorHandler extends Error {
    constructor(StatusCode, message) {
        super(message);
        this.StatusCode = StatusCode;
        this.message = message;
    }
}
exports.default = { CustomAPIErrorHandler };
