import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import Gig from "../../models/gigs.model";
import Bid from "../../models/bids.model";
import { Types } from "mongoose";
import { getBidsForGigParamValidationSchema } from "../../valildations/bid/bid.validation";

const getBidsForGigController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate params
    const validation = getBidsForGigParamValidationSchema.safeParse({
      params: req.params,
    });

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Validation failed";
      return next(new CustomError(400, errorMessage));
    }

    const { gigId } = validation.data.params;
    const { user } = req;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return next(new CustomError(404, "Gig not found"));
    }

    if (gig.ownerId.toString() !== user?.userId) {
      return next(
        new CustomError(403, "Unauthorized to view bids for this gig"),
      );
    }

    const bids = await Bid.find({ gigId: new Types.ObjectId(gigId) }).populate(
      "bidderId",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: `Fetched all bids for gig ${gigId} successfully`,
      result: bids,
    });
  },
);
export default getBidsForGigController;
