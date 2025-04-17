import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUser from "../hooks/user.hooks";
import { createQuizForJobPosting } from "../lib/api.lib";

// Error Message Component
interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <div className="alert alert-danger mt-2">{message}</div>;
};

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number | null;
  correctAnswer: string;
}

const CreateQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: null,
      correctAnswer: "",
    },
  ]);
  const [quizNameError, setQuizNameError] = useState<string | null>(null);
  const [questionErrors, setQuestionErrors] = useState<string[]>([]);
  const [optionErrors, setOptionErrors] = useState<string[]>([]); // New state for option errors
  const [correctAnswerErrors, setCorrectAnswerErrors] = useState<string[]>([]); // New state for correct answer errors

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [disableInput, setDisableInput] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !user) window.location.href = "/login";
    if (!isLoading && user?.userRole !== "Employer") window.location.href = "/";
  }, [user, isLoading]);

  useEffect(() => {
    // Initialize validation errors for quiz name and questions
    setQuizNameError(quizName.trim() ? null : "Quiz name is required.");
    const initialQuestionErrors = questions.map((q) =>
      q.questionText.trim() ? "" : "Question text cannot be empty."
    );
    setQuestionErrors(initialQuestionErrors);

    // Initialize validation errors for correct answers
    const initialCorrectAnswerErrors = questions.map((q) =>
      q.correctAnswerIndex !== null ? "" : "Please select a correct answer."
    );
    setCorrectAnswerErrors(initialCorrectAnswerErrors);
  }, [questions]);

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuizName(value);
    setQuizNameError(value.trim() ? null : "Quiz name is required.");
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);

    const newErrors = [...questionErrors];
    newErrors[index] = value.trim() ? "" : "Question text cannot be empty.";
    setQuestionErrors(newErrors);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);

    validateOptions(qIndex); // Validate options immediately
  };

  const handleCorrectAnswerChange = (qIndex: number, answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswerIndex = answerIndex;
    newQuestions[qIndex].correctAnswer =
      newQuestions[qIndex].options[answerIndex];
    setQuestions(newQuestions);

    // Validate correct answer immediately
    const newCorrectAnswerErrors = [...correctAnswerErrors];
    newCorrectAnswerErrors[qIndex] =
      answerIndex !== null ? "" : "Please select a correct answer.";
    setCorrectAnswerErrors(newCorrectAnswerErrors);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: null,
        correctAnswer: "",
      },
    ]);
  };

  const validateOptions = (questionIndex: number) => {
    const options = questions[questionIndex].options;
    console.log(options)
    const uniqueOptions = new Set(
      options
        .filter(opt => opt.trim())
        .map(opt => opt.trim())
    );// Ignore empty options

    const hasEmptyOption = options.some((opt) => !opt.trim());
    console.log(uniqueOptions)

    const newOptionErrors = [...optionErrors];
    if (hasEmptyOption) {
      newOptionErrors[questionIndex] = "All options must be filled.";
    } else if (uniqueOptions.size !== options.length) {
      newOptionErrors[questionIndex] = "Options must be unique.";
    } else {
      newOptionErrors[questionIndex] = "";
    }
    setOptionErrors(newOptionErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableInput(true);

    if (
      quizNameError ||
      questionErrors.some((err) => err) ||
      optionErrors.some((err) => err) ||
      correctAnswerErrors.some((err) => err)
    ) {
      setDisableInput(false);
      return;
    }

    if (jobId) {
      const data = { jobId, body: { questions, quizName } };
      try {
        await createQuizForJobPosting(data);
        navigate(`/view-job-posting?ID=${jobId}`);
      } catch (error) {
        setDisableInput(false);
      }
    }
  };

  const isFormValid = () => {
    return (
      quizName.trim() &&
      !quizNameError &&
      !questionErrors.some((err) => err) &&
      !optionErrors.some((err) => err) &&
      !correctAnswerErrors.some((err) => err) && // Ensure no correct answer errors
      questions.every((q) => q.correctAnswerIndex !== null) // Ensure a correct answer is selected
    );
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            <i className="bi bi-pencil-square me-2"></i>
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Quiz Name Input */}
            <div className="mb-4">
              <input
                type="text"
                className={`form-control form-control-lg text-center ${
                  quizNameError ? "is-invalid" : ""
                }`}
                placeholder="Enter Quiz Name"
                value={quizName}
                onChange={handleQuizNameChange}
                disabled={disableInput}
              />
              {/* Quiz Name Error */}
              <div className="invalid-feedback">{quizNameError}</div>
            </div>

            {/* Questions */}
            {questions.map((questionData, questionIndex) => (
              <div key={questionIndex} className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">
                      <i className="bi bi-question-circle me-2"></i>
                    </h5>
                    <div className="flex-grow-1 mx-2">
                      <input
                        type="text"
                        className={`form-control ${
                          questionErrors[questionIndex] ? "is-invalid" : ""
                        }`}
                        placeholder={`Enter Question ${questionIndex + 1}`}
                        value={questionData.questionText}
                        onChange={(e) =>
                          handleQuestionChange(questionIndex, e.target.value)
                        }
                        disabled={disableInput}
                      />
                      <div className="invalid-feedback d-block">
                        {questionErrors[questionIndex]}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setQuestions(
                          questions.filter((_, i) => i !== questionIndex)
                        )
                      }
                      disabled={disableInput}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  {/* Answers */}
                  <div className="row mt-3">
                    {questionData.options.map((option, answerIndex) => (
                      <div key={answerIndex} className="col-6 mb-2">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Answer ${answerIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                answerIndex,
                                e.target.value
                              )
                            }
                            onBlur={() => validateOptions(questionIndex)}
                            disabled={disableInput}
                          />
                          <span className="input-group-text">
                            <input
                              type="radio"
                              name={`correct-answer-${questionIndex}`}
                              checked={
                                questionData.correctAnswerIndex === answerIndex
                              }
                              onChange={() =>
                                handleCorrectAnswerChange(
                                  questionIndex,
                                  answerIndex
                                )
                              }
                              disabled={disableInput}
                            />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage message={optionErrors[questionIndex]} />
                  <ErrorMessage message={correctAnswerErrors[questionIndex]} />
                </div>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              className="btn btn-outline-success mb-3"
              onClick={handleAddQuestion}
              disabled={disableInput}
            >
              <i className="bi bi-plus-circle"></i>
            </button>
            <div className="mb-3"></div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isFormValid()} // Disable button until form is valid
            >
              <i className="bi bi-check-circle"></i> Create Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
