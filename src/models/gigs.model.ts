import mongoose from "mongoose";
import IGig, { GigStatus } from "../@types/interface/schemas/gig.interface";

const gigSchema = new mongoose.Schema<IGig>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true, min: 0 },
    deadline: { type: Date, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GigStatus),
      default: GigStatus.OPEN,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  },
  { timestamps: true },
);

const Gig = mongoose.model<IGig>("Gigs", gigSchema);
export default Gig;
