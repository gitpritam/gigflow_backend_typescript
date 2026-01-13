import mongoose from "mongoose";
import { GigStatus } from "../schemas/gig.interface";

interface MatchStage {
  $or?: Array<{
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  status?: GigStatus;
  budget?: {
    $gte?: number;
    $lte?: number;
  };
  ownerId?: mongoose.Types.ObjectId;
}

export default MatchStage;
