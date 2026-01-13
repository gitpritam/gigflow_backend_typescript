import mongoose from "mongoose";

export enum BidStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}
interface IBid {
  gigId: mongoose.Types.ObjectId;
  bidderId: mongoose.Types.ObjectId;
  price: number;
  message?: string;
  status: BidStatus;
}

export default IBid;
