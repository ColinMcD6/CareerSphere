import { Model } from "mongoose";
import sessionModel, { sessionDocument } from "../models/session.model";
import mongoose from "mongoose";

class SessionDAO {
  private model: Model<sessionDocument>;

  constructor() {
    this.model = sessionModel;
  }

  async findById(sessionID: string): Promise<sessionDocument | null> {
    return await this.model.findById(sessionID);
  }

  async findOne(searchCriteria: {}): Promise<sessionDocument | null> {
    return await this.model.findOne(searchCriteria);
  }

  async findByIdAndUpdate(id: any, update? : {}, options? : {}): Promise< sessionDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, options);
  }

  async create(data: {}): Promise<sessionDocument> {
    return await this.model.create(data);
  }

  async deleteMany(query: {}): Promise<any> {
    return await this.model.deleteMany(query);
  }

}

const sessionDAO = new SessionDAO();
export default sessionDAO;
