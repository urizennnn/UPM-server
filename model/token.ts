import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";

interface TokenI extends Document {
  refreshToken: string;
  userAgent: string;
  isValid: boolean;
  UserId: object;
  email: string;
  ip: string;
}

const TokenSchema: Schema = new Schema<TokenI>(
  {
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    UserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Token = model<TokenI>("Token", TokenSchema);

export default Token;
