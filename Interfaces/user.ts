import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string | undefined;
  verified: Date | number;
  passwordToken: string | null;
  passTokenExpiration: Date | string;
  Device: Array<number | string>;
}
