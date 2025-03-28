import { Router } from "express";
import { getUserHandler, updateUserDetails } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/", getUserHandler);

userRoutes.put("/update", updateUserDetails)

export default userRoutes;
