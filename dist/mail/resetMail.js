"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const promises_1 = __importDefault(require("fs/promises"));
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
async function forgotPassword(email, origin, token) {
    try {
        const URL = `${origin}/user/forgot-password?token=${token}&email=${email}`;
        const html = await promises_1.default.readFile(__dirname + "/../html/alert.html", "utf-8");
        const htmlEmail = html.replace("${verifyEmail}", URL);
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: process.env.VERIFIED_EMAIL,
            subject: "Forgot password",
            html: htmlEmail,
        };
        await mail_1.default.send(msg);
    }
    catch (error) {
        throw new custom_error_1.default("Internal Server Error", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.default = forgotPassword;
