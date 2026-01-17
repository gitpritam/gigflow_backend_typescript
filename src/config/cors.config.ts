import { env } from "./env.config";

const corsOptions = {
  origin: [env.corsOrigin, "http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

export default corsOptions;
