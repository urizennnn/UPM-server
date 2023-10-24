import express, { Request, Response } from "express";
const router = express.Router();
import auth from "../middleware/auth";
import {
  login,
  createUser,
  updateInfo,
  delUser,
  verifyEmail,
  logout,
  forgotPasswordUser,
  resetPassword,
} from "../controller/user";

router.route("/").post(createUser).put(auth, updateInfo).delete(auth, delUser);
router.post("/login", login);
router.delete("/logout", auth, logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPasswordUser);
router.post("/reset-password", resetPassword);

export default router;
