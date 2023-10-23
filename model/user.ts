import bcrypt from "bcryptjs";
import { Schema, model, Document } from "mongoose";
import { config } from "dotenv";
import { User } from "../Interfaces/user";
config();

const userSchema: Schema = new Schema<User>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passTokenExpiration: {
      type: Date,
    },
    Device: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = model<User>("User", userSchema);
export default User;
