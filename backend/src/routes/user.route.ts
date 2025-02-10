import { Router } from "express";
import { addUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

//prefix: /user
userRoutes.post("/add", addUserHandler);

export default userRoutes;