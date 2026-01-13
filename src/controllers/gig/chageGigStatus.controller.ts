import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import { changeGigStatusValidationSchema } from "../../valildations/gig/gig.validation";
import Gig from "../../models/gigs.model";

const changeGigStatusController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate request params and body
    const validation = changeGigStatusValidationSchema.safeParse({
      params: req.params,
      body: req.body,
    });
    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Validation failed";
      return next(new CustomError(400, errorMessage));
    }

    const { gigId } = validation.data.params;
    const { status } = validation.data.body;

    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { status },
      { new: true },
    );
    if (!updatedGig) {
      return next(new CustomError(404, "Gig not found"));
    }

    res.status(200).json({
      success: true,
      message: `Gig status changed to ${status} successfully`,
      result: updatedGig,
    });
  },
);

export default changeGigStatusController;
