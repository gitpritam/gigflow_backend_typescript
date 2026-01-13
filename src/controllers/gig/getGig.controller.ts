import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import Gig from "../../models/gigs.model";
import { gigParamSchema } from "../../valildations/gig/gig.validation";

const getGigController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gigId } = req.params;

    const validation = gigParamSchema.safeParse({ gigId });
    if (!validation.success) {
      return next(new CustomError(400, "Invalid Gig ID"));
    }

    const gig = await Gig.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(validation.data.gigId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedUser",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$assignedUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          budget: 1,
          deadline: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: 1,
            name: 1,
            email: 1,
          },
          assignedUser: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

    if (!gig || gig.length === 0) {
      return next(new CustomError(404, "Gig not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Gig fetched successfully",
      result: gig[0],
    });
  },
);

export default getGigController;
