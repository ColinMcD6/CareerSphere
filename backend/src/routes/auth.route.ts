import { Router } from "express";
import { signupcontroller } from "../controllers/auth_controllers/signupcontroller";
import { logincontroller } from "../controllers/auth_controllers/logincontroller";
import { logoutcontroller } from "../controllers/auth_controllers/logoutcontroller";
import { refreshcontroller } from "../controllers/auth_controllers/refreshcontroller";
import { forgotPassController } from "../controllers/auth_controllers/forgotPassController";
import { changePasswordController } from "../controllers/auth_controllers/changePassController";
import { verifyEmailController } from "../controllers/auth_controllers/verifyEmailController";

const authRoutes = Router();

//prefix: /auth
authRoutes.post("/signup", signupcontroller);

authRoutes.post("/login", logincontroller);

authRoutes.get("/logout", logoutcontroller);

authRoutes.get("/refresh", refreshcontroller);

authRoutes.get("/email/verify/:code", verifyEmailController);

authRoutes.post("/password/forgot", forgotPassController);

authRoutes.post("/password/reset", changePasswordController);

export default authRoutes;