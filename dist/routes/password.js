"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
const password_1 = require("../controller/password");
router
    .post("/createPassword", auth_1.default, password_1.createpasswordEntry)
    .patch("/addPassword", auth_1.default, password_1.addPassword)
    .delete("/deletePassword", auth_1.default, password_1.deletePassword);
router.get("/", (req, res) => {
    res.send("Hit");
});
exports.default = router;
