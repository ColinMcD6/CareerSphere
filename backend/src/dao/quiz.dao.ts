import { Model } from "mongoose";
import Quiz, { QuizDocument } from "../models/main/quiz.model";
import mongoose from "mongoose";


/**
 * * QuizDAO Class
 * * @description - This class handles the data access operations for the Quiz model.
 * * It provides methods to create, find, update, and delete quiz documents in the database.
 */
class QuizDAO {
  private model: Model<QuizDocument>;

  constructor() {
    this.model = Quiz;
  }

  async create(newQuiz: QuizDocument) {
    return await this.model.create(newQuiz);
  }

  isValidId(quizId: string): boolean {
    return mongoose.isValidObjectId(quizId);
  }
  async save(quiz: QuizDocument) {
    console.log("Attemping to save")
    return await quiz.save();
  }

  async findByQuizId(quizId: string): Promise<QuizDocument | null> {
    return await this.model.findById(quizId);
  }

  async findByJobId(jobId: string): Promise<QuizDocument[]> {
    return await this.model.find({ jobId });
  }

  async findQuizByQuizIdJobId(
    quizId: string,
    jobId: string
  ): Promise<QuizDocument | null> {
    return await this.model.findOne({ _id: quizId, jobId });
  }

  async find(
    query: Object,
    page: number,
    limit: number
  ): Promise<QuizDocument[]> {
    return await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countQuizes() {
    return await Quiz.countDocuments();
  }
}

const quizDAO = new QuizDAO();
export default quizDAO;
