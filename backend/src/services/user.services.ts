import { CONFLICT } from "../constants/http";
import UserModel from "../models/users.model";
import appAssert from "../utils/appAssert";

export type CreateUserParams = {
    firstName: string;
    lastName: string;
};

export const createUser = async (data: CreateUserParams) => {
    const existingUser = await UserModel.exists({
        firstName: data.firstName,
        lastName: data.lastName
    })

    appAssert(!existingUser, CONFLICT, "User already exists!");
    
    const user = await UserModel.create({
        firstName: data.firstName,
        lastName: data.lastName,
    })

    return {
        user: user
    };
}

export const getRandomUser = async () => {
    const users = await UserModel.aggregate([{ $sample: {size: 1}}]);
    return users[0];
}