"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ManagerSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    passManager: {
        type: Map,
        of: new mongoose_1.Schema({
            someField: { type: String },
            anotherField: { type: Number },
        }),
    },
});
const Manager = (0, mongoose_1.model)("Manager", ManagerSchema);
exports.default = Manager;
