import Mail from "@sendgrid/mail";
import fs from "fs/promises";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";

async function verificationEmail(
  email: string,
  origin: string,
  token: string,
): Promise<void> {
  try {
    const URL = `${origin}/user/verify-email?token=${token}&email=${email}`;
    const html = await fs.readFile(
      __dirname + "/../html/verification.html",
      "utf-8",
    );
    const htmlMail = html.replace("${verifyEmail}", URL);
    Mail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const msg: {
      to: string;
      from: string;
      subject: string;
      html: string;
    } = {
      to: email,
      from: process.env.VERIFIED_EMAIL as string,
      subject: "Verify Your Email",
      html: htmlMail,
    };

    await Mail.send(msg);
  } catch (error) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export default verificationEmail;
