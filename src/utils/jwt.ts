import IJwtPayload from "../@types/interface/jwtPayload.interface";
import { env } from "../config/env.config";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateAccessToken = (
  payload: IJwtPayload,
  expiresIn = env.jwtExpiresIn as StringValue,
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.jwtSecret as Secret, options);
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret as Secret) as IJwtPayload;
    return decoded;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
