import Token from "../model/token";
import User from "../model/user";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";

async function deleteToken(email: string): Promise<void> {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = await Token.findOne({ email: existingUser.email });
      if (token) {
        await Token.deleteOne({ token });
      }
    }
  } catch (error: any) {
    throw new CustomAPIErrorHandler(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
export default deleteToken;
