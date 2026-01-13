import { Router } from "express";
import {
  createBidController,
  getBidsForGigController,
  hireBidController,
} from "../controllers/bid";
import { validateRequest } from "../middlewares/validate.middleware";
import { createBidValidationSchema } from "../valildations/bid/bid.validation";
import authenticate from "../middlewares/auth.middleware";

const bidRouter = Router();

bidRouter.get("/:gigId", authenticate, getBidsForGigController);

bidRouter.post(
  "/",
  authenticate,
  validateRequest(createBidValidationSchema),
  createBidController,
);

bidRouter.patch("/:bidId/hire", authenticate, hireBidController);

export default bidRouter;
