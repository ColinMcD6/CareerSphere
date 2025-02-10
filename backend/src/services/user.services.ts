import UserModel from "../models/users.model";

export type CreateUserParams = {
    firstName: string;
    lastName: string;
};

export const createUser = async (data: CreateUserParams) => {
    const user = await UserModel.create({
        firstName: data.firstName,
        lastName: data.lastName,
    })
}