import { Model } from "mongoose";
import ResumeModel, { ResumeDocument } from "../models/resume.model";

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
