import { Model } from "mongoose";
import ResumeModel, { ResumeDocument } from "../models/main/resume.model";


/**
 * * ResumeDAO Class
 * * @description - This class handles the data access operations for the Resume model.
 * * It provides methods to create, find, update, and delete resume documents in the database.
 */
class ResumeDAO {
  private model: Model<ResumeDocument>;

  constructor() {
    this.model = ResumeModel;
  }

  async findById(id: string): Promise<ResumeDocument | null> {
    return await this.model.findById(id);
  }

  async create(data: any) : Promise<ResumeDocument | null> {
    return await this.model.create(data);
  }
}

const resumeDAO = new ResumeDAO();
export default resumeDAO;
