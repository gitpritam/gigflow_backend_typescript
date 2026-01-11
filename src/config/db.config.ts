import mongoose from "mongoose";
import { env } from "./env.config";

const connectDB = async () => {
  try {
    await mongoose.connect(env.databaseUrl);
    console.log(`Database connected for ${env.nodeEnv} environment`);
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Database Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
