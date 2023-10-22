"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(url) {
    try {
        await mongoose_1.default.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to the MongoDB database.");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
exports.connectDB = connectDB;
