import * as jwt from "jsonwebtoken";
import { Response } from "express";

function createJWT<Type>(payload: Type): string {
  const token = jwt.sign(
    payload as string | object | Buffer,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );
  return token;
}

function verifyJWT(token: string): string | object {
  const userToken = jwt.verify(token, process.env.JWT_SECRET as string);
  return userToken;
}

function cookies<Type>(res: Response, user: Type, refreshToken: Type): void {
  const accessTokenJWT = createJWT(user);
  const refreshTokenJWT = createJWT({ user, refreshToken });
  const timeLimit = 1000 * 60 * 60 * 24;
  res.cookie("accessToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + timeLimit),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
}
export  {
  createJWT,
  verifyJWT,
  cookies,
};
