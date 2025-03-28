import mongoose, { Document, Schema, Model } from "mongoose";

// Define the QuizDocument interface
export interface QuizDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  quizName: string;
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: string;
  }[];
  submissions: {
    candidateId: string;
    candidateUsername: string;
    score: number;
  }[];
}

// Define the Quiz Schema
const quizSchema = new Schema<QuizDocument>({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  quizName: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true },
    },
  ],
  submissions: [
    {
      candidateId: { type: String, required: true },
      candidateUsername: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
});

const Quiz: Model<QuizDocument> = mongoose.model<QuizDocument>("Quiz", quizSchema);
export default Quiz;
