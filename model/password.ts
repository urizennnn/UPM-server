import { Schema, model, Document } from "mongoose";
import { ManagerI, PassManagerValue } from "../Interfaces/password";

const ManagerSchema: Schema = new Schema<ManagerI>({
  email: {
    type: String,
    required: true,
  },
  passManager: {
    type: Map,
    of: new Schema<PassManagerValue>({
      someField: { type: String },
      anotherField: { type: Number },
    }),
  },
});

const Manager = model<ManagerI>("Manager", ManagerSchema);

export default Manager;
