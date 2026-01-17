import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import IJWTPayload from "../@types/interface/jwtPayload.interface";
import { env } from "./env.config";
import cookie from "cookie";

let io: Server;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: [
        env.corsOrigin,
        "http://127.0.0.1:5173",
        "http://localhost:5173",
      ],
      credentials: true,
    },
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    const rawCookie = socket.handshake.headers.cookie;
    const cookies = cookie.parse(rawCookie || "");
    const token = cookies["token"];
    console.log("Socket.IO auth token:", token);
    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as IJWTPayload;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.data.user.userId}`);

    // Join user to their personal room
    socket.join(socket.data.user.userId);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.user.userId}`);
    });
  });

  console.log("Socket.IO initialized");
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initializeSocket first.");
  }
  return io;
};
