import User from "../model/user";
import Manager from "../model/password";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { promises } from "dns";

export async function createpasswordEntry(
  req: Request,
  res: Response,
): Promise<any> {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new CustomAPIErrorHandler(
      "User does not exist. Please create a user with this email and try again.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const existingManager = await Manager.findOne({ email });
  if (existingManager) {
    throw new CustomAPIErrorHandler(
      "Password manager already exists for this user. Proceed to update.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const newInput = await Manager.create(req.body);

  return res.status(StatusCodes.CREATED).json(newInput);
}

export async function addPassword(req: Request, res: Response): Promise<any> {
  try {
    const { email, name, password } = req.body;
    const exists = await Manager.findOne({ email });

    const exist = await User.findOne({ email });
    if (!exist) {
      throw new CustomAPIErrorHandler(
        "User does not exist please create an account and try again",
        StatusCodes.BAD_REQUEST,
      );
    }
    if (!exists) {
      throw new CustomAPIErrorHandler(
        "'Please create a User or check the URL address and try again'",
        StatusCodes.BAD_REQUEST,
      );
    }

    const updatedUser = await Manager.findOneAndUpdate(
      { email },
      { $set: { [`passManager.${name}`]: password } },
      { upsert: true, new: true },
    );

    await exists.save();

    return res.status(201).json({ name, password });
  } catch (error: any) {
    throw new CustomAPIErrorHandler(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function deletePassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, name, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomAPIErrorHandler(
        "User not found",
        StatusCodes.BAD_REQUEST,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new CustomAPIErrorHandler(
        "Invalid password",
        StatusCodes.BAD_REQUEST,
      );
    }

    const manager = await Manager.findOne({ email });

    if (!manager) {
      throw new CustomAPIErrorHandler(
        "No Passwords to delete",
        StatusCodes.BAD_REQUEST,
      );
    }
    const pass: any = manager.passManager;

    for (const [key, value] of pass) {
      if (key === name) {
        pass.delete(key);
        await manager.save();
      }
    }

    res.status(200).json(pass);

    for (const [key, value] of Object.entries(pass)) {
      if (key === name) {
        delete pass[key];
        await manager.save();
      }
    }
    res.status(200).json(pass);
  } catch (error: any) {
    throw new CustomAPIErrorHandler(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
