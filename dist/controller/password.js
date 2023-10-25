"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPasswords = exports.DeletePassword = exports.createPassword = void 0;
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const helper_1 = require("./helper");
const redist_1 = require("./redist");
async function createPassword(req, res) {
    try {
        const { name, password } = req.body;
        const user = await (0, helper_1.decodeToken)(req, res);
        const client = await (0, redist_1.connectRedis)();
        await client.HSET("Userpassword", name, password);
        const pass = await client.hGetAll("Userpassword");
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user, pass });
    }
    catch (error) { }
}
exports.createPassword = createPassword;
async function DeletePassword(req, res) {
    try {
        await (0, helper_1.decodeToken)(req, res);
        const { name } = req.body;
        const client = await (0, redist_1.connectRedis)();
        const key = await client.hGetAll("Userpassword");
        for (const i of Object.keys(key)) {
            if (name === i) {
                const result = await client.hDel("Userpassword", name);
                if (result === 1) {
                    return res.status(http_status_codes_1.StatusCodes.OK).json("Deleted Successfuly");
                }
                else {
                    return res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json("Something went wrong");
                }
            }
        }
    }
    catch (error) {
        throw new custom_error_1.default(error, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.DeletePassword = DeletePassword;
async function showPasswords(req, res) {
    const client = await (0, redist_1.connectRedis)();
    const results = await client.hGetAll('Userpassword');
    return res.status(http_status_codes_1.StatusCodes.OK).json(results);
}
exports.showPasswords = showPasswords;
