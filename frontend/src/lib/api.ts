import API from "../config/apiClient";

interface UserResponse {
  username: string;
  email: string;
  userRole: string;
  experience: string[];
  education: string[];
  skills: string[];
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

export const logoutUser = async()=> {
  API.get("/auth/logout")
}

export const verifyEmail = async(code: string) => {
  console.log(code)
  API.get(`/auth/email/verify/${code}`)
}

export const sendresetPassEmail = async(data: {
  email: string
}) => {
  console.log(data)
  API.post("/auth/password/forgot", data)
}

export const changePassword = async(data: { verifycode: string, password: string }) => {
  console.log(data)
  API.post("/auth/password/reset", data)
}