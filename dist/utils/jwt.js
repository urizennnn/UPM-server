"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookies = exports.verifyJWT = exports.createJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
function createJWT(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
}
exports.createJWT = createJWT;
function verifyJWT(token) {
    const userToken = jwt.verify(token, process.env.JWT_SECRET);
    return userToken;
}
exports.verifyJWT = verifyJWT;
function cookies(res, user, refreshToken) {
    const accessTokenJWT = createJWT(user);
    const refreshTokenJWT = createJWT({ user, refreshToken });
    const timeLimit = 1000 * 60 * 60 * 24;
    res.cookie("accessToken", refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: 1000,
    });
    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + timeLimit),
        secure: process.env.NODE_ENV === "production",
        signed: true,
    });
}
exports.cookies = cookies;
