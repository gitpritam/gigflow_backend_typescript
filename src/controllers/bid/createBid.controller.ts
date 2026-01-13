import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import Gig from "../../models/gigs.model";
import Bid from "../../models/bids.model";
import mongoose from "mongoose";

const createBidController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { gigId, price, message } = req.body;
    console.log(gigId, price, message);
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return next(new CustomError(404, "Gig not found"));
    }

    if (gig.status !== "open") {
      return next(new CustomError(400, "bidding Closed"));
    }

    if (gig.ownerId.toString() === user?.userId) {
      return next(new CustomError(400, "You cannot bid on your own gig"));
    }

    const existingBid = await Bid.findOne({
      gigId: new mongoose.Types.ObjectId(gigId),
      bidderId: new mongoose.Types.ObjectId(user?.userId),
    });
    if (existingBid) {
      return next(
        new CustomError(400, "You have already placed a bid on this gig"),
      );
    }

    if (gig.budget < price) {
      return next(
        new CustomError(
          400,
          `Bid price cannot exceed gig budget of ${gig.budget}`,
        ),
      );
    }

    const newBid = await Bid.create({
      gigId: new mongoose.Types.ObjectId(gigId),
      bidderId: new mongoose.Types.ObjectId(user!.userId),
      price,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Bid created successfully",
      result: newBid,
    });
  },
);
export default createBidController;
