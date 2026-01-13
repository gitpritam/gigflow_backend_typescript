import { Router } from "express";
import { validateRequest } from "../middlewares/validate.middleware";
import { createGigValidationSchema } from "../valildations/gig/gig.validation";
import {
  changeGigStatusController,
  createGigController,
  getGigController,
  getGigsController,
} from "../controllers/gig";
import authenticate from "../middlewares/auth.middleware";

const gigRouter = Router();

gigRouter.post(
  "/",
  authenticate,
  validateRequest(createGigValidationSchema),
  createGigController,
);

gigRouter.get("/", authenticate, getGigsController);
gigRouter.get("/:gigId", authenticate, getGigController);

gigRouter.patch("/:gigId/status", authenticate, changeGigStatusController);

export default gigRouter;
