import * as jwt from "jsonwebtoken";
import { Response } from "express";

export function createJWT<Type>(payload: Type): string {
  const token = jwt.sign(payload as object, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIMIT as string,
  });
  return token;
}

export function verifyJWT(token: string): string | object {
  const userToken = jwt.verify(token, process.env.JWT_SECRET as string);
  return userToken;
}

export function cookies(
  res: Response,
  user: object,
  refreshToken: string,
): void {
  console.log("Ran through cookies");
  const accessTokenJWT = createJWT(user);
  const refreshTokenJWT = createJWT({ user, refreshToken });
  const timeLimit = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: timeLimit,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + timeLimit),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
}
