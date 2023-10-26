"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPasswordUser = exports.verifyEmail = exports.updateInfo = exports.logout = exports.login = exports.delUser = exports.showUser = exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const token_1 = __importDefault(require("../model/token"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const custom_error_1 = __importDefault(require("../error/custom-error"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
const index_1 = require("../mail/index");
const redis_1 = require("./redis");
const tokenDeletion_1 = __importDefault(require("./tokenDeletion"));
const helper_1 = require("./helper");
const origin = process.env.ORIGIN;
const client = (0, redis_1.connectRedis)();
async function createUser(req, res) {
    const { email, password } = req.body;
    try {
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            throw new custom_error_1.default("User already exists", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const Device = (0, helper_1.getMac)();
        const verificationToken = (0, helper_1.createVerificationToken)();
        const newUser = await user_1.default.create({
            email,
            password,
            verificationToken,
            Device,
        });
        const tokenUser = { email: newUser.email, UserId: newUser._id };
        //@ts-ignore
        await (0, index_1.verificationEmail)(newUser.email, newUser.verificationToken, origin);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ tokenUser, verificationToken });
    }
    catch (err) {
        throw new custom_error_1.default(err.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.createUser = createUser;
async function showUser(req, res) {
    try {
        const data = await user_1.default.find({});
        //@ts-ignore
        console.log(req.user);
        res.status(http_status_codes_1.StatusCodes.OK).json(data);
    }
    catch (err) {
        throw new custom_error_1.default("Internal Server Error", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.showUser = showUser;
async function delUser(req, res) {
    try {
        const { email } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        if (!existingUser) {
            throw new custom_error_1.default("User not found", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        await Promise.all([user_1.default.deleteOne({ email }), (0, index_1.deleted)(existingUser.email)]);
        const userDel = await (await client).DEL("Userpassword");
        if (userDel !== 1) {
            throw new custom_error_1.default("Error Deleting Password", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "User deleted successfully." });
    }
    catch (error) {
        throw new custom_error_1.default("Internal Server Error", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.delUser = delUser;
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new custom_error_1.default("Invalid Request", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        const existingUser = await user_1.default.findOne({ email });
        if (!existingUser) {
            throw new custom_error_1.default("User not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            throw new custom_error_1.default("Invalid password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        if (!existingUser.isVerified) {
            throw new custom_error_1.default("Please verify your email", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        let deviceFound = true;
        const devices = existingUser.Device;
        const curDevice = (0, helper_1.getMac)();
        // console.log(`This is the MAC :${curDevice}`);
        devices.forEach((device) => {
            // console.log(device, curDevice);
            if (device !== curDevice) {
                deviceFound = false;
                console.log("Ran Through Device");
            }
        });
        //@ts-ignore
        const UserPasswords = await (await client).hGetAll("Userpassword");
        if (deviceFound) {
            console.log("Found Device");
            await (0, index_1.loginAlert)(existingUser.email);
        }
        const tokenUser = {
            email: existingUser.email,
            UserId: existingUser._id,
        };
        let refreshToken;
        const existingToken = await token_1.default.findOne({ user: existingUser._id });
        if (existingToken) {
            console.log("Ran through Token");
            const { isValid } = existingToken;
            if (!isValid) {
                throw new custom_error_1.default("Invalid Credentials", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
        }
        refreshToken = (0, helper_1.generateRefreshToken)();
        const userAgent = req.headers["user-agent"];
        const ip = req.ip;
        const userToken = {
            email,
            refreshToken,
            ip,
            userAgent,
            UserId: existingUser._id,
        };
        await token_1.default.create(userToken);
        (0, jwt_1.cookies)(res, tokenUser, refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Logged in", UserPasswords });
    }
    catch (err) {
        throw new custom_error_1.default(err, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.login = login;
async function logout(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new custom_error_1.default("Invalid Request", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const existingUser = await user_1.default.findOne({ email });
        await (0, helper_1.decodeToken)(req, res);
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, 
        //@ts-ignore
        existingUser.password);
        if (!isPasswordCorrect) {
            throw new custom_error_1.default("User not found", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
        await (0, tokenDeletion_1.default)(email);
        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: `${email} logged out` });
    }
    catch (err) {
        throw new custom_error_1.default("Internal Server Error", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.logout = logout;
async function updateInfo(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        await (0, helper_1.decodeToken)(req, res);
        if (oldPassword && newPassword) {
            const isOldPassValid = await bcryptjs_1.default.compare(oldPassword, 
            //@ts-ignore
            existingUser.password);
            if (!isOldPassValid) {
                throw new custom_error_1.default("Invalid old password", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            //@ts-ignore
            existingUser.password = newPassword;
        }
        else {
            throw new custom_error_1.default("Both old password and new password are required.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        //@ts-ignore
        await existingUser.save();
        //@ts-ignore
        await (0, index_1.detailsUpdated)(existingUser.email);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "User information updated successfully." });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
    }
}
exports.updateInfo = updateInfo;
async function verifyEmail(req, res) {
    try {
        const { verificationToken, email } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            throw new custom_error_1.default("Verification failed", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        if (user.verificationToken !== verificationToken) {
            throw new custom_error_1.default("Verification failed", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        user.isVerified = true;
        user.verified = Date.now();
        user.verificationToken = "";
        await user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Email Verified" });
    }
    catch (err) {
        throw new custom_error_1.default(err.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.verifyEmail = verifyEmail;
async function forgotPasswordUser(req, res) {
    const { email } = req.body;
    if (!email) {
        throw new custom_error_1.default("Please provide email", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const emailExist = await user_1.default.findOne({ email });
    if (emailExist) {
        const passToken = crypto_1.default.randomBytes(20).toString("hex");
        await (0, index_1.forgotPassword)(emailExist.email, origin, passToken);
        const time = 1000 * 60 * 15;
        emailExist.passTokenExpiration = new Date(Date.now() + time);
        emailExist.passwordToken = (0, helper_1.createHash)(passToken);
        await emailExist.save();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ msg: "Please check your email for verification link" });
    }
}
exports.forgotPasswordUser = forgotPasswordUser;
async function resetPassword(req, res) {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
        throw new custom_error_1.default("Please provide all values", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const user = await user_1.default.findOne({ email });
    if (user) {
        const curDate = new Date();
        if (user.passwordToken === (0, helper_1.createHash)(token) &&
            user.passTokenExpiration > curDate) {
            user.password = password;
            user.passwordToken = null;
            user.passTokenExpiration = "";
            await user.save();
            await (0, index_1.successMail)(user.email);
        }
    }
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ msg: "Successful" });
}
exports.resetPassword = resetPassword;
