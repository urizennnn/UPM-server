import * as os from "os";
import * as crypto from "crypto";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";

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

export { getMac, createHash, createVerificationToken, generateRefreshToken };
