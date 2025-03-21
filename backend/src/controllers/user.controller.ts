import { NextFunction, Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import UserModel from "../models/users.model";
import appAssert from "../utils/appAssert";

export const getUserHandler = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserModel.findById(req.userId);
        appAssert(user, NOT_FOUND, "User account does not exist !")
        res.status(OK).json(user.removePassword());
    }
);

export const updateUserDetails = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { education, skills, experience, hiringDetails, companyDetails } = req.body;

        // Find user by ID
        const user = await UserModel.findById(req.userId);
        appAssert(user, NOT_FOUND, "User account does not exist!");

        // Check user role
        if (user.userRole === "Candidate") {
            if (education) user.education = education;
            if (skills) user.skills = skills;
            if (experience) user.experience = experience;
        } else if (user.userRole === "Employer") {
            if (companyDetails) user.companyDetails = companyDetails;
            if (hiringDetails) user.hiringDetails = hiringDetails;
        }

        // Save updated user details
        await user.save();
        res.status(200).json({ message: "User details updated successfully", user });
    }
);


