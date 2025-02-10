import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { createUser } from "../services/user.services";
import { CREATED } from "../constants/http";

const userSchema = z.object({
    firstName: z.string().min(1).max(225),
    lastName: z.string().min(1).max(225),
})

export const addUserHandler = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const request = userSchema.parse(req.body);    
    const user = await createUser(request);
    res.status(CREATED).json(user);
});