import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import User from "../../models/users.model";
import CustomError from "../../utils/customError";

const meController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    if (!userId) {
      return next(new CustomError(401, "Unauthorized: User not authenticated"));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new CustomError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      result: {
        user,
      },
    });
  },
);

export default meController;
