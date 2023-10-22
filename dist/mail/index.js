"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleted = exports.detailsUpdated = exports.verificationEmail = exports.successMail = exports.forgotPassword = exports.loginAlert = void 0;
var alert_1 = require("./alert");
Object.defineProperty(exports, "loginAlert", { enumerable: true, get: function () { return __importDefault(alert_1).default; } });
var resetMail_1 = require("./resetMail");
Object.defineProperty(exports, "forgotPassword", { enumerable: true, get: function () { return __importDefault(resetMail_1).default; } });
var successMail_1 = require("./successMail");
Object.defineProperty(exports, "successMail", { enumerable: true, get: function () { return __importDefault(successMail_1).default; } });
var verificationMail_1 = require("./verificationMail");
Object.defineProperty(exports, "verificationEmail", { enumerable: true, get: function () { return __importDefault(verificationMail_1).default; } });
var detailesChanged_1 = require("./detailesChanged");
Object.defineProperty(exports, "detailsUpdated", { enumerable: true, get: function () { return __importDefault(detailesChanged_1).default; } });
var delete_1 = require("./delete");
Object.defineProperty(exports, "deleted", { enumerable: true, get: function () { return __importDefault(delete_1).default; } });
