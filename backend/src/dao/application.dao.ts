import { Model } from "mongoose";
import ApplicationModel, { ApplicationDocument } from "../models/application.model";

class ApplicationDAO {
  private model: Model<ApplicationDocument>;

  constructor() {
    this.model = ApplicationModel;
  }
  
  async create(data: ApplicationDocument) : Promise<ApplicationDocument | null> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<ApplicationDocument | null> {
    return await this.model.findById(id);
  }

   async findOne(query: {}): Promise<ApplicationDocument | null> {
    return await this.model.findOne(query);
  }

  async findByIdAndUpdate(id: string, update1: {}, update2: {}): Promise<ApplicationDocument | null> {
    return await this.model.findByIdAndUpdate(id, update1, update2);
  }

  async findByIdAndDelete(id: string): Promise<ApplicationDocument | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async find(query: {}): Promise<ApplicationDocument[]> {
    return await this.model.find(query);
  }

  async countDocuments(query: {}): Promise<number> {
    return await this.model.countDocuments(query);
  }

}

const applicationDAO = new ApplicationDAO();
export default applicationDAO;
