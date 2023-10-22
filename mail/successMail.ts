import Mail from "@sendgrid/mail";
import fs from "fs/promises";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";

async function successMail(email: string): Promise<void> {
  try {
    const html = await fs.readFile(__dirname + "/../html/alert.html", "utf-8");

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
      html: html,
    };

    await Mail.send(msg);
  } catch (error) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export default successMail;
