import express, { Request, Response } from "express";
const router = express.Router();
import auth from "../middleware/auth";
import {
  createpasswordEntry,
  addPassword,
  deletePassword,
} from "../controller/password";
router
  .post("/createPassword", auth, createpasswordEntry)
  .patch("/addPassword", auth, addPassword)
  .delete("/deletePassword", auth, deletePassword);

router.get("/", (req: Request, res: Response) => {
  res.send("Hit");
});

export default router;
