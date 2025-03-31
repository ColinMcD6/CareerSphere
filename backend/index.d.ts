import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types;
      sessionId: mongoose.Types;
      userRole: string;
    }
  }
}
export {};