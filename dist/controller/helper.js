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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateRefreshToken = exports.createVerificationToken = exports.createHash = exports.getMac = void 0;
const os = __importStar(require("os"));
const crypto = __importStar(require("crypto"));
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const jwt = __importStar(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
function getMac() {
    try {
        const networkInterfaces = os.networkInterfaces();
        const defaultInterface = networkInterfaces.eth0;
        if (!defaultInterface) {
            throw new custom_error_1.default("'No Address found", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        return defaultInterface[1].mac;
    }
    catch (error) {
        throw new custom_error_1.default(error, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.getMac = getMac;
function createHash(string) {
    return crypto.createHash("md5").update(string).digest("hex");
}
exports.createHash = createHash;
function createVerificationToken() {
    return crypto.randomBytes(40).toString("hex");
}
exports.createVerificationToken = createVerificationToken;
function generateRefreshToken() {
    return crypto.randomBytes(40).toString("hex");
}
exports.generateRefreshToken = generateRefreshToken;
async function decodeToken(req, res) {
    const token = req.signedCookies.refreshToken;
    const decode = jwt.decode(token, { complete: true });
    //@ts-ignore
    const email = decode?.payload.user.email;
    if (!email) {
        throw new custom_error_1.default("No Token or User found", http_status_codes_1.StatusCodes.OK);
    }
    const user = await user_1.default.findOne({ email });
    if (!user) {
        console.log(user);
        throw new custom_error_1.default("No User found", http_status_codes_1.StatusCodes.OK);
    }
    return email;
}
exports.decodeToken = decodeToken;
