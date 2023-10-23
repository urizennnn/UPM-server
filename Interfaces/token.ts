import { Document } from "mongoose";

export interface TokenI extends Document {
  refreshToken: string;
  userAgent: string;
  isValid: boolean;
  UserId: object;
  email: string;
  ip: string;
}
