import mongoose from "mongoose";
import { z } from "zod";

export const createBidValidationSchema = z.object({
  gigId: z
    .string("Gig ID is required")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid Gig ID format",
    }),
  price: z
    .number("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),
  message: z
    .string()
    .max(500, "Message must not exceed 500 characters")
    .optional(),
});

export const getBidsForGigParamValidationSchema = z.object({
  params: z.object({
    gigId: z
      .string("Gig ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Gig ID format",
      }),
  }),
});

export const hireBidParamValidationSchema = z.object({
  params: z.object({
    bidId: z
      .string("Bid ID is required")
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Bid ID format",
      }),
  }),
});
