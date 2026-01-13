import mongoose from "mongoose";
import { z } from "zod";
import { GigStatus } from "../../@types/interface/schemas/gig.interface";

export const createGigValidationSchema = z.object({
  title: z
    .string("Title is required")
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must not exceed 1000 characters")
    .trim(),
  budget: z
    .number("Budget is required")
    .positive("Budget must be a positive number")
    .min(1, "Budget must be at least 1"),
  deadline: z.iso.date("Deadline in required"),
});

export const gigParamSchema = z.object({
  gigId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  }),
});

export const changeGigStatusValidationSchema = z.object({
  params: z.object({
    gigId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId",
    }),
  }),
  body: z.object({
    status: z.enum(
      GigStatus,
      `Status must be one of: ${Object.values(GigStatus).join(", ")}`,
    ),
  }),
});

export const getGigsQueryValidationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
        message: "Page must be a positive number",
      }),
    limit: z
      .string()
      .optional()
      .default("10")
      .refine(
        (val) =>
          !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 100,
        {
          message: "Limit must be a positive number between 1 and 100",
        },
      ),
    search: z.string().optional().default(""),
    sortBy: z
      .enum(["createdAt", "updatedAt", "title", "budget", "deadline", "status"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    status: z.enum(Object.values(GigStatus)).optional(),
    ownership: z
      .string()
      .optional()
      .refine((val) => val === undefined || val === "true" || val === "false", {
        message: "Ownership must be 'true' or 'false'",
      }),
    minBudget: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        {
          message: "Min budget must be a non-negative number",
        },
      ),
    maxBudget: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        {
          message: "Max budget must be a non-negative number",
        },
      ),
  }),
});
