import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/customError";
import jwt from "jsonwebtoken";
import IJWTPayload from "../@types/interface/jwtPayload.interface";
import { env } from "../config/env.config";

const authenticate = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //headers = authorization -> Bearer "token"
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(
        new CustomError(401, "Unauthorized: Access token is required."),
      );
    }

    const payloadDecoded: IJWTPayload = jwt.verify(
      token,
      env.jwtSecret,
    ) as IJWTPayload;

    req.user = payloadDecoded;

    next();
  },
);

export default authenticate;
