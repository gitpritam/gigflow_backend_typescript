import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import mongoose from "mongoose";
import Bid from "../../models/bids.model";
import Gig from "../../models/gigs.model";
import User from "../../models/users.model";
import { hireBidParamValidationSchema } from "../../valildations/bid/bid.validation";
import { BidStatus } from "../../@types/interface/schemas/bid.interface";
import { GigStatus } from "../../@types/interface/schemas/gig.interface";
import { getIO } from "../../config/socket.config";

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
    console.log(`Hiring bid with ID: ${bidId} by user: ${user?.userId}`);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) {
        throw new CustomError(404, "Bid not found");
      }
      console.log("Bid found:", bid);

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
      console.log("Gig updated to ASSIGNED");
      await Bid.updateOne(
        { _id: bid._id },
        { status: BidStatus.ACCEPTED },
        { session },
      );
      console.log("Bid updated to ACCEPTED");
      await Bid.updateMany(
        {
          gigId: gig._id,
          _id: { $ne: bid._id },
        },
        { status: BidStatus.REJECTED },
        { session },
      );
      console.log("Other bids updated to REJECTED");
      await session.commitTransaction();
      console.log("Transaction committed");
      session.endSession();
      console.log("Session ended");

      // Send notification to the hired bidder
      try {
        const freelancer = await User.findById(bid.bidderId).select("name");
        const io = getIO();

        console.log(
          `Attempting to send notification to user: ${bid.bidderId.toString()}`,
        );

        io.to(bid.bidderId.toString()).emit("notification", {
          type: "BID_ACCEPTED",
          message: `Congratulations! Your bid has been accepted for "${gig.title}"`,
          data: {
            bidId: bid._id,
            gigId: gig._id,
            gigTitle: gig.title,
            price: bid.price,
          },
          timestamp: new Date(),
        });

        console.log(
          `Notification sent to ${freelancer?.name || "freelancer"} (${bid.bidderId})`,
        );
      } catch (socketError) {
        console.error("Error sending socket notification:", socketError);
        // Don't fail the request if notification fails
      }

      return res.status(200).json({
        success: true,
        message: "Freelancer hired successfully",
      });
    } catch (error) {
      console.error("Error in hireBidController:", error);
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
