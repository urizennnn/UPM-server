import { Schema, model, Document } from "mongoose";

interface ManagerI extends Document {
  email: string;
  passManager: Map<string, PassManagerValue>;
}

interface PassManagerValue {
  someField: string;
  anotherField: number;
}

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
