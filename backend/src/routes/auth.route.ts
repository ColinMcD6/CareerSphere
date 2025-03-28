import { Router } from "express";
import { signupController } from "../controllers/auth_controllers/signup.controller";
import { loginController } from "../controllers/auth_controllers/login.controller";
import { logoutController } from "../controllers/auth_controllers/logout.controller";
import { refreshController } from "../controllers/auth_controllers/refresh.controller";
import { forgotPassController } from "../controllers/auth_controllers/forgotPass.controller";
import { changePasswordController } from "../controllers/auth_controllers/changePass.controller";
import { verifyEmailController } from "../controllers/auth_controllers/verifyEmail.controller";

const authRoutes = Router();

//prefix: /auth
authRoutes.post("/signup", signupController);

authRoutes.post("/login", loginController);

authRoutes.get("/logout", logoutController);

authRoutes.get("/refresh", refreshController);

authRoutes.get("/email/verify/:code", verifyEmailController);

authRoutes.post("/password/forgot", forgotPassController);

authRoutes.post("/password/reset", changePasswordController);

export default authRoutes;