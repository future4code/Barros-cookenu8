import express from "express";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router()
const userController = new UserController()
userRouter.post("/signup", userController.signUp)
userRouter.post("/login", userController.login)
userRouter.get("/user/profile", userController.getProfile)
userRouter.get("/user/:id", userController.getOtherProfile)
userRouter.post("/user/:id/follow", userController.follow)