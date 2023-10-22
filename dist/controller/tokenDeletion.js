"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../model/token"));
const user_1 = __importDefault(require("../model/user"));
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
async function deleteToken(email) {
    try {
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            const token = await token_1.default.findOne({ email: existingUser.email });
            if (token) {
                await token_1.default.deleteOne({ token });
            }
        }
    }
    catch (error) {
        throw new custom_error_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.default = deleteToken;
