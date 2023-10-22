"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verified: Date,
    passwordToken: {
        type: String,
    },
    passTokenExpiration: {
        type: Date,
    },
    Device: {
        type: Array,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
