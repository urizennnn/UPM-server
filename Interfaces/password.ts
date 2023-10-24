import { Document } from "mongoose";

export interface ManagerI extends Document {
  email: string;
  passManager: object;
}

