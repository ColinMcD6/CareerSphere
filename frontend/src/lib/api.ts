import API from "../config/apiClient";

interface UserResponse {
    firstName: string,
    lastName: string
}

export const getUser = async (): Promise<UserResponse> => API.get("/user/random-user")