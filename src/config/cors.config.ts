import { env } from "./env.config";

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      return callback(null, true);
    }

    // Parse CORS_ORIGIN from environment - can be comma-separated list
    const allowedOrigins = [env.corsOrigin];

    // In development, also allow localhost
    if (env.isDevelopment) {
      allowedOrigins.push("http://127.0.0.1:5173", "http://localhost:5173");
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      console.error(`Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("Not allowed by CORS"));
    }
    console.log("CORS check for origin:", allowedOrigins);
  },
  credentials: true,
};

export default corsOptions;
