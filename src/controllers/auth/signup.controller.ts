import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import User from "../../models/users.model";
import CustomError from "../../utils/customError";
import { hashPassword } from "../../utils/password";

const signupController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError(409, "User already exists with this email"));
    }

    const hashedPassword = await hashPassword(password);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = await User.create(payload);
    if (!newUser) {
      return next(new CustomError(400, "User registration failed"));
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      result: newUser,
    });
  },
);

export default signupController;
