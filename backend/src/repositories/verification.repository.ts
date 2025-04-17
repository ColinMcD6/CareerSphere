import { Model } from "mongoose";
import verificationModel, { verificationDocument } from "../models/supportModels/verify.model";
/**
 * * VerificationDAO Class
 * * @description - This class handles the data access operations for the Verification model.
 * * It provides methods to create, find, update, and delete verification documents in the database.
 */
class VerificationDAO {
  private model: Model<verificationDocument>;

  constructor() {
    this.model = verificationModel;
  }

  async findById(verificationID: string): Promise<verificationDocument | null> {
    return await this.model.findById(verificationID);
  }

  async findOne(searchCriteria: {}): Promise<verificationDocument | null> {
    return await this.model.findOne(searchCriteria);
  }

  async findByIdAndUpdate(id: any, update? : {}, options? : {}): Promise< verificationDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, options);
  }

  async create(data: {}): Promise<verificationDocument> {
    return await this.model.create(data);
  }
}

const verificationDAO = new VerificationDAO();
export default verificationDAO;
