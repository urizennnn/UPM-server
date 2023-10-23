import Mail from "@sendgrid/mail";
import fs from "fs/promises";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";

async function loginAlert(email: string): Promise<void> {
  try {
    const html = await fs.readFile(__dirname + "/../html/alert.html", "utf-8");

    Mail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const msg = {
      to: email,
      from: process.env.VERIFIED_EMAIL as string,
      subject: "New Login Alert",
      html: html,
    };
    // console.log(msg)
    await Mail.send(msg);
  } catch (error: any) {
    throw new CustomAPIErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default loginAlert;
