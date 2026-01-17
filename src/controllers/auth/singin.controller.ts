import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import User from "../../models/users.model";
import CustomError from "../../utils/customError";
import { comparePassword } from "../../utils/password";
import { generateAccessToken } from "../../utils/jwt";
import { env } from "../../config/env.config";

const signinController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(401, "Invalid email or password"));
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return next(new CustomError(401, "Invalid email or password"));
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    user.password = "";

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });

    res.status(200).json({
      httpOnly: true,
      success: true,
      message: "User signed in successfully",
      result: {
        user,
        token: accessToken,
      },
    });
  },
);
export default signinController;
