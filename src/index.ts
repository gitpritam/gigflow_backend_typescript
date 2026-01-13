import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.config";
import CustomError from "./utils/customError";
import MainRouter from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware";
import connectDB from "./config/db.config";
import { env } from "./config/env.config";
import { initializeSocket } from "./config/socket.config";

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.name, err.message);
  console.error("Shutting down server...");
  process.exit(1);
});

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", MainRouter);

// Handle 404 for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(
    404,
    `Can't find ${req.originalUrl} in this server`,
  );
  next(err);
});

app.use(globalErrorHandler);

initializeSocket(server);
connectDB();

const PORT = env.port;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
