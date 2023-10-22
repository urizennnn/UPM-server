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
exports.deletePassword = exports.addPassword = exports.createpasswordEntry = void 0;
const user_1 = __importDefault(require("../model/user"));
const password_1 = __importDefault(require("../model/password"));
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt = __importStar(require("bcrypt"));
async function createpasswordEntry(req, res) {
    const { email } = req.body;
    const existingUser = await user_1.default.findOne({ email });
    if (!existingUser) {
        throw new custom_error_1.default("User does not exist. Please create a user with this email and try again.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const existingManager = await password_1.default.findOne({ email });
    if (existingManager) {
        throw new custom_error_1.default("Password manager already exists for this user. Proceed to update.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const newInput = await password_1.default.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json(newInput);
}
exports.createpasswordEntry = createpasswordEntry;
async function addPassword(req, res) {
    try {
        const { email, name, password } = req.body;
        const exists = await password_1.default.findOne({ email });
        const exist = await user_1.default.findOne({ email });
        if (!exist) {
            throw new custom_error_1.default("User does not exist please create an account and try again", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (!exists) {
            throw new custom_error_1.default("'Please create a User or check the URL address and try again'", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const updatedUser = await password_1.default.findOneAndUpdate({ email }, { $set: { [`passManager.${name}`]: password } }, { upsert: true, new: true });
        await exists.save();
        return res.status(201).json({ name, password });
    }
    catch (error) {
        throw new custom_error_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.addPassword = addPassword;
async function deletePassword(req, res) {
    try {
        const { email, name, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            throw new custom_error_1.default("User not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new custom_error_1.default("Invalid password", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const manager = await password_1.default.findOne({ email });
        if (!manager) {
            throw new custom_error_1.default("No Passwords to delete", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const pass = manager.passManager;
        for (const [key, value] of pass) {
            if (key === name) {
                pass.delete(key);
                await manager.save();
            }
        }
        res.status(200).json(pass);
        for (const [key, value] of Object.entries(pass)) {
            if (key === name) {
                delete pass[key];
                await manager.save();
            }
        }
        res.status(200).json(pass);
    }
    catch (error) {
        throw new custom_error_1.default(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.deletePassword = deletePassword;
