import { Router } from "express";
import authRouter from "./auth.router";
import gigRouter from "./gig.router";
import bidRouter from "./bid.router";

const MainRouter = Router();

MainRouter.use("/auth", authRouter);
MainRouter.use("/gigs", gigRouter);
MainRouter.use("/bids", bidRouter);
export default MainRouter;
