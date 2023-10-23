"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = require("../controller/user");
router.route("/").post(user_1.createUser).put(auth_1.default, user_1.updateInfo).delete(auth_1.default, user_1.delUser);
router.post("/login", user_1.login);
router.delete("/logout", auth_1.default, user_1.logout);
router.post("/verify-email", user_1.verifyEmail);
router.post("/forgot-password", user_1.forgotPasswordUser);
router.post("/reset-password", user_1.resetPassword);
router.get("/test", (req, res) => {
    res.send("Hit");
});
exports.default = router;
