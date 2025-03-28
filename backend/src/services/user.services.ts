import { CONFLICT, NOT_FOUND} from "../constants/http.constants";
import userDAO from "../dao/user.dao";
import appAssert from "../utils/appAssert";
import { Category } from "../models/main/jobPostings.model";



/**
 * * Get User
 * * @description - This function retrieves a user by their ID and removes the password field from the response.
 * * @param {string} id - The ID of the user to be retrieved.
 * * @returns {Promise<{ user: any, removePassword: any }>} - The user object without the password field.
 */
export const getUser = async (id: string) => {
    const user = await userDAO.findById(id);
    if (!user)
        appAssert(false, CONFLICT, "User does not exist, invalid ID!"); // This will throw an error, and return a 409 response
    
    const removePassword = user.removePassword();
    return {
        user,
        removePassword
    };
}



/**
 * * Update User
 * * @description - This function updates user details based on their role (Candidate or Employer).
 * * @param {string} id - The ID of the user to be updated.
 * * @param {any} updates - The updates to be applied to the user.
 * * @returns {Promise<any>} - The updated user object.
 */
export const updateUser = async (id: string, updates: any) => {
    // Find user by ID
    //const user = await UserModel.findById(req.userId);
    const user = await userDAO.findById(id);
    appAssert(user, NOT_FOUND, "User account does not exist!");

    if(updates.phoneNumber) user.phoneNumber = updates.phoneNumber;
    if(updates.userlink) user.userlink = updates.userlink;

    // Check user role
    if (user.userRole === "Candidate") {
        if (updates.education) user.education = updates.education;
        if (updates.skills) user.skills = updates.skills;
        if (updates.experience) user.experience = updates.experience;
    } else if (user.userRole === "Employer") {
        if (updates.companyDetails) user.companyDetails = updates.companyDetails;
        if (updates.hiringDetails) user.hiringDetails = updates.hiringDetails;
    }

    let category = updates.preference as number;
    if(category >= 0 && category <= Category.Other)
    {
        user.preferences[updates.preference] += 1;
    }
    // Save updated user details
    await user.save();

    return user;
}
