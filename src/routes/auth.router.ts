import express from "express";
import {
  logoutController,
  signinController,
  signupController,
  meController,
} from "../controllers/auth";
import authenticate from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import signinValidationSchema, {
  signupValidationSchema,
} from "../valildations/auth/auth.validation";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateRequest(signupValidationSchema),
  signupController,
);
authRouter.post(
  "/login",
  validateRequest(signinValidationSchema),
  signinController,
);
authRouter.post("/logout", authenticate, logoutController);
authRouter.get("/me", authenticate, meController);

export default authRouter;
