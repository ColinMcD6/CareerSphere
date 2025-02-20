import API from "../config/apiClient";

interface UserResponse {
  name: string;
  email: string;
  password: string;
}

export const getUser = async (): Promise<UserResponse> =>
  API.get("/user/random-user");
