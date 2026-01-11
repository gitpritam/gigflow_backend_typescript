import { Request, Response, NextFunction } from "express";

import CustomError from "../utils/customError";

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  stack?: string;
  details?: unknown;
}

// Utility function for sending error responses
const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  req: Request,
  stack?: string,
  details?: unknown,
): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Include stack trace and details only in local
  if (process.env.NODE_ENV !== "prod") {
    if (stack) errorResponse.stack = stack;
    if (details) errorResponse.details = details;
  }

  res.status(statusCode).json(errorResponse);
};

const handleJWTError = (): CustomError =>
  new CustomError(401, "Invalid token. Please log in again.");

const handleJWTExpiredError = (): CustomError =>
  new CustomError(401, "Your token has expired. Please log in again.");

// Main global error handler
const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Set default values
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }

  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  // Handle programming errors in production
  if (process.env.NODE_ENV === "prod" && !error.isOperational) {
    // Don't leak error details in production for programming errors
    sendErrorResponse(res, 500, "Something went wrong!", req);
    return;
  }

  // Send error response
  sendErrorResponse(
    res,
    error.statusCode,
    error.message,
    req,
    process.env.NODE_ENV !== "prod" ? err.stack : undefined,
    process.env.NODE_ENV !== "prod" ? err : undefined,
  );
};

export default globalErrorHandler;
