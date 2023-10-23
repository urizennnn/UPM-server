import { Document } from "mongoose";

export interface ManagerI extends Document {
  email: string;
  passManager: Map<string, PassManagerValue>;
}

export interface PassManagerValue {
  someField: string;
  anotherField: number;
}
