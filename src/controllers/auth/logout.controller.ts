import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";

const logoutController = AsyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  },
);

export default logoutController;