"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const token_1 = __importDefault(require("../model/token"));
async function auth(req, res, next) {
    try {
        const { accessToken, refreshToken } = req.signedCookies;
        const payload = (0, jwt_1.verifyJWT)(refreshToken);
        if (!payload) {
            throw new custom_error_1.default("Invalid JWT payload", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const existing = await token_1.default.findOne({
            //@ts-ignore
            UserId: payload.user.UserId,
            //@ts-ignore
            refreshToken: payload.refreshToken,
        });
        if (!existing) {
            throw new custom_error_1.default("Not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        //@ts-ignore
        (0, jwt_1.cookies)(res, payload.user, existing.refreshToken);
        //@ts-ignore
        req.user = payload.user;
        next();
    }
    catch (error) {
        throw new custom_error_1.default("Something Went Wrong", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.default = auth;
