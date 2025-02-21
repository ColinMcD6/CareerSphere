import API from "../config/apiClient";

interface UserResponse {
  username: string;
  email: string;
  password: string;
}

export const getUser = async (): Promise<UserResponse> =>
  API.get("/user");

export const checklogIn = async (data: { email: string, password: string }) => 
  API.post("/auth/login", data)

export const registerUser = async (data: {
  email: string, 
  username: string, 
  userRole: string, 
  password: string,
  confirm_password: string
}) => {
  API.post("/auth/signup", data)
}

export const sendforgotpassReq = async(data: {
  email: string
}) => {
  API.post("/auth/password/forgot", data)
}

export const logoutUser = async()=> {
  API.get("/auth/logout")
}
