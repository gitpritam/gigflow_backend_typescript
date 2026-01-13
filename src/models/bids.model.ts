import mongoose from "mongoose";
import IBid, { BidStatus } from "../@types/interface/schemas/bid.interface";

const bidSchema = new mongoose.Schema<IBid>(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gigs",
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(BidStatus),
      default: BidStatus.PENDING,
    },
  },
  { timestamps: true },
);

const Bid = mongoose.model<IBid>("Bids", bidSchema);

export default Bid;
