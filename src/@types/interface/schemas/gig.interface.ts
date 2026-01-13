import mongoose from "mongoose";

export enum GigStatus {
  OPEN = "open",
  ASSIGNED = "assigned",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

interface IGig {
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  ownerId: mongoose.Types.ObjectId;
  status: GigStatus;
  assignedTo?: mongoose.Types.ObjectId;
}

export default IGig;
