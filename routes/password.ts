import express, { Request, Response } from "express";
const router = express.Router();
import auth from "../middleware/auth";
import {
  createpasswordEntry,
  addPassword,
  deletePassword,
  showPassword
} from "../controller/password";
router
  .post("/createPassword", auth, createpasswordEntry)
  .patch("/addPassword", auth, addPassword)
  .delete("/deletePassword", auth, deletePassword)
  .get('/showPasswords',auth,showPassword)

export default router;
