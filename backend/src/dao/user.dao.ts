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

  async findOne(searchCriteria: {}): Promise<UserDocument | null> {
    return await this.model.findOne(searchCriteria);
  }

  async findByIdAndUpdate(id: any, update? : {}, options? : {}): Promise< UserDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, options);
  }

  async create(data: {}): Promise<UserDocument> {
    return await this.model.create(data);
  }

  async exists(query: {}): Promise< {} | null> {
    return await this.model.exists(query);
  }
}

const userDAO = new UserDAO();
export default userDAO;
