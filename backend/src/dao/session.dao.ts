import { Model } from "mongoose";
import sessionModel, { sessionDocument } from "../models/one-to-many/session.model";

/**
 * * SessionDAO Class
 * * @description - This class handles the data access operations for the Session model.
 * * It provides methods to create, find, update, and delete session documents in the database.
 */
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

  async deleteById(id: string): Promise<any> {
    return await this.model.findByIdAndDelete(id);
  }


}

const sessionDAO = new SessionDAO();
export default sessionDAO;
