import { Schema, model, Document } from "mongoose";
import { ManagerI } from "../Interfaces/password";

const ManagerSchema: Schema = new Schema<ManagerI>({
  email: {
    type: String,
    required: true,
  },
  passManager: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
});

const Manager = model<ManagerI>("Manager", ManagerSchema);

export default Manager;
