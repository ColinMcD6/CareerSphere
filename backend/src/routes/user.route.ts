import { Router } from "express";
import { addUserHandler, getUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

//prefix: /user
userRoutes.post("/add", addUserHandler);
userRoutes.get("/random-user", getUserHandler);

export default userRoutes;