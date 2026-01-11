class CustomError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;

  constructor(statusCode: number = 500, message: string = "An error occurred") {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true; // Only for handling operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
