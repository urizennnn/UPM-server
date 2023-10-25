import express, { Request, Response } from "express";
const router = express.Router();
import auth from "../middleware/auth";

import { createPassword, DeletePassword ,showPasswords} from "../controller/password";
router
  .get("/", auth, createPassword)
  .delete("/delete-password", DeletePassword)
  .get('/show',auth,showPasswords)
export default router;
