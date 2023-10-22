import { Request, Response } from "express";
import User from "../model/user";
import Manager from "../model/password";
import Token from "../model/token";
import bcryptjs from "bcryptjs";
import CustomAPIErrorHandler from "../error/custom-error";
import { StatusCodes } from "http-status-codes";
import { cookies } from "../utils/jwt";
import crypto from "crypto";
import {
  verificationEmail,
  successMail,
  deleted,
  loginAlert,
  detailsUpdated,
  forgotPassword,
} from "../mail/index";
//@ts-ignore
import { deleteToken } from "./tokenDeletion";
import {
  getMac,
  createHash,
  createVerificationToken,
  generateRefreshToken,
} from "./helper";
const origin = process.env.ORIGIN as string;

export async function createUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomAPIErrorHandler(
        "User already exists",
        StatusCodes.BAD_REQUEST,
      );
    }
    const Device = getMac();
    const verificationToken = createVerificationToken();
    const newUser = await User.create({
      email,
      password,
      verificationToken,
      Device,
    });
    const tokenUser = { email: newUser.email, UserId: newUser._id };
    //@ts-ignore
    await verificationEmail(newUser.email, newUser.verificationToken, origin);
    res.status(StatusCodes.CREATED).json({ tokenUser });
  } catch (err) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function showUser(req: Request, res: Response): Promise<void> {
  try {
    const data = await User.find({});
    //@ts-ignore
    console.log(req.user);
    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
export async function delUser(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new CustomAPIErrorHandler(
        "User not found",
        StatusCodes.BAD_REQUEST,
      );
    }

    await Promise.all([
      User.deleteOne({ email }),
      Manager.deleteOne({ email }),
      deleted(existingUser.email),
    ]);
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ message: "User deleted successfully." });
  } catch (error) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomAPIErrorHandler(
        "Invalid Request",
        StatusCodes.UNAUTHORIZED,
      );
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new CustomAPIErrorHandler(
        "User not found",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new CustomAPIErrorHandler(
        "Invalid password",
        StatusCodes.UNAUTHORIZED,
      );
    }

    if (!existingUser.isVerified) {
      throw new CustomAPIErrorHandler(
        "Please verify your email",
        StatusCodes.UNAUTHORIZED,
      );
    }
    let devicefound: boolean = false;
    const devices: any = existingUser.Device;
    const curDevice = getMac();
    devices.forEach(async (device: number | string) => {
      if (device === curDevice) {
        devicefound = true;
        return;
      }
      if (!devicefound) await loginAlert(existingUser.email);
      const tokenUser: object = {
        email: existingUser.email,
        UserId: existingUser._id,
      };
      let refreshToken: string;
      const existingToken = await Token.findOne({ user: existingUser._id });

      if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
          throw new CustomAPIErrorHandler(
            "Invalid Credentials",
            StatusCodes.UNAUTHORIZED,
          );
        }
        refreshToken = generateRefreshToken();
        const userAgent = req.headers["user-agent"];
        const ip = req.ip;
        const userToken: object = {
          email,
          refreshToken,
          ip,
          userAgent,
          UserId: existingUser._id,
        };

        await Token.create(userToken);
        cookies(res, tokenUser, refreshToken);
        const UserPasswords = await Manager.findOne({ email });
        return res
          .status(StatusCodes.OK)
          .json({ message: "Logged in", UserPasswords });
      }
    });
  } catch (err) {
    throw new CustomAPIErrorHandler(
      "Interna Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomAPIErrorHandler(
        "Invalid Request",
        StatusCodes.BAD_REQUEST,
      );
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new CustomAPIErrorHandler(
        "User not found",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    const isPasswordCorrect: boolean = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      throw new CustomAPIErrorHandler(
        "User not found",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    await deleteToken(email);
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(StatusCodes.OK).json({ msg: `${email} logged out` });
  } catch (err) {
    throw new CustomAPIErrorHandler(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function updateInfo(req: Request, res: Response): Promise<void> {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new CustomAPIErrorHandler(
        "User not found or invalid credentials",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (oldPassword && newPassword) {
      const isOldPassValid = await bcryptjs.compare(
        oldPassword,
        existingUser.password,
      );

      if (!isOldPassValid) {
        throw new CustomAPIErrorHandler(
          "Invalid old password",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      existingUser.password = newPassword;
    } else {
      throw new CustomAPIErrorHandler(
        "Both old password and new password are required.",
        StatusCodes.BAD_REQUEST,
      );
    }
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    await existingUser.save();
    await detailsUpdated(existingUser.email);

    res
      .status(StatusCodes.OK)
      .json({ message: "User information updated successfully." });
  } catch (err: any) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomAPIErrorHandler(
        "Verification failed",
        StatusCodes.UNAUTHORIZED,
      );
    }
    if (user.verificationToken !== verificationToken) {
      throw new CustomAPIErrorHandler(
        "Verification failed",
        StatusCodes.UNAUTHORIZED,
      );
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = "";
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Email Verified" });
  } catch (err: any) {
    throw new CustomAPIErrorHandler(
      err.message,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function forgotPasswordUser(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  if (!email) {
    throw new CustomAPIErrorHandler(
      "Please provide email",
      StatusCodes.BAD_REQUEST,
    );
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    const passToken = crypto.randomBytes(20).toString("hex");

    await forgotPassword(emailExist.email, origin, passToken);

    const time = 1000 * 60 * 15;
    emailExist.passTokenExpiration = new Date(Date.now() + time);
    emailExist.passwordToken = createHash(passToken);
    await emailExist.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Please check your email for verification link" });
  }
}
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    throw new CustomAPIErrorHandler(
      "Please provide all values",
      StatusCodes.BAD_REQUEST,
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    const curDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passTokenExpiration > curDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passTokenExpiration = "";
      await user.save();
      await successMail(user.email);
    }
  }
  res.status(StatusCodes.ACCEPTED).json({ msg: "Successful" });
}
