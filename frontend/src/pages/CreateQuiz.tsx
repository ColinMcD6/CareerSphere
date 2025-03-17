import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createQuizForJobPosting } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import useUser from "../hooks/user";

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
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");
  const navigate = useNavigate(); // For redirection
  const { user, isLoading } = useUser();


  // If the user is not logged in, redirect them away from this page
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
    if ( !isLoading && user?.userRole !== "Employer") // If they are not an employer, redirect them to home
    {
      window.location.href = "/";
    }
  }, [user, isLoading]);

  // Handle question input change
  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  // Handle answer input change
  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[answerIndex] = value;
    setQuestions(newQuestions);
  };

  // Handle radio button change (marking the correct answer)
  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswerIndex = answerIndex;
    newQuestions[questionIndex].correctAnswer =
      newQuestions[questionIndex].options[answerIndex];
    setQuestions(newQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < questions.length; i++) {
      const {
        questionText: question,
        options: answers,
        correctAnswerIndex,
      } = questions[i];
      if (!question.trim()) {
        alert(`Please enter a question for Question ${i + 1}.`);
        return;
      }
      if (answers.some((answer) => !answer.trim())) {
        alert(`Please fill in all answer fields for Question ${i + 1}.`);
        return;
      }
      if (correctAnswerIndex === null) {
        alert(`Please mark the correct answer for Question ${i + 1}.`);
        return;
      }
    }

    if (jobId !== null) {
      console.log("Sending a create quiz request to backend");
      const data = {
        jobId: jobId,
        body: {
          questions: questions,
          quizName: quizName,
        },
      };
      try {
        const response = await createQuizForJobPosting(data);
        console.log("Quiz successfully created!");
        const WAIT_TIME = 3000;
        // Show success toast
        toast.success("Quiz successfully created and added to job posting!", {
          position: "top-center",
          autoClose: WAIT_TIME,
        });

        setTimeout(() => {
          navigate(`/view-job-posting?ID=${jobId}`);
        }, WAIT_TIME);
      } catch (error: any) {
        console.log("Received an error from server");
        console.log(error);
        alert(error.message);
      }
    }
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((unused, i) => i !== index); // Return all questions that are not index
    setQuestions(newQuestions);
  };

  // Add a new question
  const addQuestion = () => {
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

  if (isLoading || user?.userRole !== "Employer")
  {
    return(<div> Loading content</div>);
  }

  return (
    <div className="container mt-5">
      <ToastContainer aria-label={undefined} />
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Create a Quiz</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label bold" htmlFor="quizNameInput">
                Enter a Name for the quiz
              </label>
              <input
                name="quizNameInput"
                id="quizNameInput"
                value={quizName}
                type="text"
                onChange={(e) => setQuizName(e.target.value)}
                className="form-control text-center"
                required
              />
            </div>

            {questions.map((questionData, questionIndex) => (
              <div
                key={questionIndex}
                className="mb-4 border border-secondary rounded"
              >
                <div className="mb-3 clearfix">
                  <label
                    htmlFor={`question-${questionIndex}`}
                    className="form-label mb-2 display-6"
                  >
                    Question {questionIndex + 1}
                  </label>
                  <button
                    type="button"
                    className="btn btn-link text-danger float-end"
                    onClick={() => deleteQuestion(questionIndex)}
                    style={{ fontSize: "1.25rem", lineHeight: "1" }}
                  >
                    <i className="bi bi-trash "></i>
                  </button>
                  <input
                    type="text"
                    id={`question-${questionIndex}`}
                    className="form-control text-center"
                    value={questionData.questionText}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, e.target.value)
                    }
                    placeholder={`Enter question ${questionIndex + 1}`}
                    required
                  />
                </div>
                <div className="row">
                  {[0, 1].map((rowIndex) => (
                    <div key={rowIndex} className="row mb-3">
                      {[0, 1].map((colIndex) => {
                        const answerIndex = rowIndex * 2 + colIndex;
                        return (
                          <div key={answerIndex} className="col-md-6">
                            <label
                              htmlFor={`answer-${questionIndex}-${answerIndex}`}
                              className="form-label"
                            >
                              Answer {answerIndex + 1}:
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                id={`answer-${questionIndex}-${answerIndex}`}
                                className="form-control"
                                value={questionData.options[answerIndex]}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    questionIndex,
                                    answerIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter answer ${answerIndex + 1}`}
                                required
                              />
                              <div className="input-group-text">
                                <input
                                  type="radio"
                                  name={`correct-answer-${questionIndex}`}
                                  className="form-check-input"
                                  checked={
                                    questionData.correctAnswerIndex ===
                                    answerIndex
                                  }
                                  onChange={() =>
                                    handleCorrectAnswerChange(
                                      questionIndex,
                                      answerIndex
                                    )
                                  }
                                />
                                <span className="ms-2">Correct</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success mb-3"
              onClick={addQuestion}
            >
              Add Another Question
            </button>
            <button type="submit" className="btn btn-primary w-100">
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
