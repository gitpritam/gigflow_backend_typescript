import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AsyncHandler from "../../utils/asyncHandler";
import CustomError from "../../utils/customError";
import Gig from "../../models/gigs.model";
import { getGigsQueryValidationSchema } from "../../valildations/gig/gig.validation";
import MatchStage from "../../@types/interface/controller/getGigs.interface";

const getGigsController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = getGigsQueryValidationSchema.safeParse({
      query: req.query,
    });

    if (!validation.success) {
      const errorMessage =
        validation.error.issues[0]?.message || "Query validation failed";
      return next(new CustomError(400, errorMessage));
    }

    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
      ownership,
      minBudget,
      maxBudget,
    } = validation.data.query;

    // Pagination calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build match stage
    const matchStage: MatchStage = {};

    // Search filter
    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      matchStage.status = status;
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      matchStage.budget = {};
      if (minBudget) {
        matchStage.budget.$gte = parseFloat(minBudget);
      }
      if (maxBudget) {
        matchStage.budget.$lte = parseFloat(maxBudget);
      }
    }

    // Ownership filter
    const userId = req.user?.userId;
    if (ownership === "true" && userId) {
      matchStage.ownerId = new mongoose.Types.ObjectId(userId);
    }

    // Build sort stage
    const sortStage: Record<string, 1 | -1> = {};
    sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get total count efficiently
    const total = await Gig.countDocuments(matchStage);

    // Build aggregation pipeline
    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limitNum },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedUser",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$assignedUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          budget: 1,
          deadline: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "owner._id": 1,
          "owner.name": 1,
          "owner.email": 1,
          "assignedUser._id": 1,
          "assignedUser.name": 1,
          "assignedUser.email": 1,
        },
      },
    ];

    // Execute aggregation
    const gigs = await Gig.aggregate(pipeline);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      message: "Gigs fetched successfully",
      result: {
        gigs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  },
);

export default getGigsController;
