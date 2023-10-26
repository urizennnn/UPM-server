import User from "../model/user";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { decodeToken } from "./helper";

import { connectRedis } from "./redis";

export async function createPassword(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const { name, password } = req.body;
    const user: string = await decodeToken(req, res);
    const client = await connectRedis();

    await client.HSET("Userpassword", name, password);

    const pass = await client.hGetAll("Userpassword");
    return res.status(StatusCodes.OK).json({ user, pass });
  } catch (error) {}
}

export async function DeletePassword(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    await decodeToken(req, res);

    const { name } = req.body;
    const client = await connectRedis();
    const key: object = await client.hGetAll("Userpassword");

    for (const i of Object.keys(key)) {
      if (name === i) {
        const result = await client.hDel("Userpassword", name);
        if (result === 1) {
          return res.status(StatusCodes.OK).json("Deleted Successfuly");
        } else {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json("Something went wrong");
        }
      }
    }
  } catch (error: any) {
    throw new CustomAPIErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function showPasswords(req: Request, res: Response): Promise<any> {
  const client = await connectRedis();

  const results = await client.hGetAll("Userpassword");
  return res.status(StatusCodes.OK).json(results);
}
