import * as os from "os";
import * as crypto from "crypto";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../model/user";

function getMac(): string {
  try {
    const networkInterfaces = os.networkInterfaces();
    const defaultInterface = networkInterfaces.eth0;

    if (!defaultInterface) {
      throw new CustomAPIErrorHandler(
        "'No Address found",
        StatusCodes.BAD_REQUEST,
      );
    }
    return defaultInterface[1].mac;
  } catch (error: any) {
    throw new CustomAPIErrorHandler(error, StatusCodes.BAD_REQUEST);
  }
}

function createHash(string: string): string {
  return crypto.createHash("md5").update(string).digest("hex");
}
function createVerificationToken(): string {
  return crypto.randomBytes(40).toString("hex");
}
function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}
async function decodeToken(req: Request, res: Response): Promise<string> {
  const token = req.signedCookies.refreshToken;
  const decode = jwt.decode(token, { complete: true });
  //@ts-ignore
  const email = decode?.payload.user.email;

  if (!email) {
    throw new CustomAPIErrorHandler("No Token or User found", StatusCodes.OK);
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log(user);
    throw new CustomAPIErrorHandler("No User found", StatusCodes.OK);
  }

  return email;
}

export {
  getMac,
  createHash,
  createVerificationToken,
  generateRefreshToken,
  decodeToken,
};
