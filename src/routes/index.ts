import { Router } from "express";
import authRouter from "./auth.router";

const MainRouter = Router();

MainRouter.use("/auth", authRouter);

export default MainRouter;
