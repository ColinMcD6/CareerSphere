import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.constants";
import appAssert from "../utils/appAssert";
import {
    getUser,
    updateUser
} from "../services/user.services";
import { get } from "mongoose";


/**
 * * Get User Details Controller
 * * @description - This controller handles the process of retrieving user details by ID.
 * * @param {Request} req - The request object containing the user's ID.
 * * @param {Response} res - The response object to send the user details back to the client.
 * * @throws {Error} - Throws an error if the user does not exist.
 */
export const getUserHandler = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { user, removePassword } = await getUser(req.userId);
        
        res.status(OK).json(removePassword);
    }
);


/**
 * * Update User Details Controller
 * * @description - This controller handles the process of updating user details.
 * * @param {Request} req - The request object containing the user's ID and updated details.
 * * @param {Response} res - The response object to send the success message back to the client.
 * * @throws {Error} - Throws an error if the user does not exist.
 */
export const updateUserDetails = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { education, skills, experience, hiringDetails, companyDetails, preference, phoneNumber, userlink } = req.body;
        const query = {
            education,
            skills,
            experience,
            hiringDetails,
            companyDetails,
            preference,
            phoneNumber,
            userlink
        }

        const user = await updateUser(req.userId, query);

        appAssert(user, NOT_FOUND, "User account does not exist !")
        
        res.status(200).json({ message: "User details updated successfully", user });
    }
);
