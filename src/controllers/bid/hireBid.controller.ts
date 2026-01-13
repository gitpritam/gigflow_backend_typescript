import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import mongoose from "mongoose";
import Bid from "../../models/bids.model";
import Gig from "../../models/gigs.model";
import { hireBidParamValidationSchema } from "../../valildations/bid/bid.validation";
import { BidStatus } from "../../@types/interface/schemas/bid.interface";
import { GigStatus } from "../../@types/interface/schemas/gig.interface";

const hireBidController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = hireBidParamValidationSchema.safeParse({
      params: req.params,
    });

    if (!validation.success) {
      return next(
        new CustomError(
          400,
          validation.error.issues[0]?.message || "Validation failed",
        ),
      );
    }

    const { bidId } = validation.data.params;
    const user = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) {
        throw new CustomError(404, "Bid not found");
      }

      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) {
        throw new CustomError(404, "Gig not found");
      }

      if (gig.ownerId.toString() !== user?.userId) {
        throw new CustomError(403, "Not authorized to hire");
      }

      if (gig.status === GigStatus.ASSIGNED) {
        throw new CustomError(400, "Gig already assigned");
      }

      await Gig.updateOne(
        { _id: gig._id, status: GigStatus.OPEN },
        {
          status: GigStatus.ASSIGNED,
          assignedTo: bid.bidderId,
        },
        { session },
      );

      await Bid.updateOne(
        { _id: bid._id },
        { status: BidStatus.ACCEPTED },
        { session },
      );

      await Bid.updateMany(
        {
          gigId: gig._id,
          _id: { $ne: bid._id },
        },
        { status: BidStatus.REJECTED },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Freelancer hired successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(
        error instanceof CustomError
          ? error
          : new CustomError(500, "Failed to hire freelancer"),
      );
    }
  },
);

export default hireBidController;
