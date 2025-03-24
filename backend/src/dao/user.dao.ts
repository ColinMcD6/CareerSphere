import { Model } from "mongoose";
import User, { UserDocument } from "../models/users.model";
import mongoose from "mongoose";

class UserDAO {
  private model: Model<UserDocument>;

  constructor() {
    this.model = User;
  }

  async findById(candidateId: string): Promise<UserDocument | null> {
    return await this.model.findById(candidateId);
  }

}

const userDAO = new UserDAO();
export default userDAO;
