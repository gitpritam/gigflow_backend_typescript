import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import Gig from "../../models/gigs.model";
import CustomError from "../../utils/customError";

const createGigController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    const { title, description, budget, deadline } = req.body;

    const payload = {
      title,
      description,
      budget,
      deadline,
      ownerId: user!.userId,
    };
    const newGig = await Gig.create(payload);
    if (!newGig) {
      return next(new CustomError(400, "Gig creation failed"));
    }

    return res.status(201).json({
      success: true,
      message: "Gig created successfully",
      result: newGig,
    });
  },
);

export default createGigController;
