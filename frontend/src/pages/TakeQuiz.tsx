import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getSpecificQuiz, submitQuizResponse } from "../lib/api";
import { useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import useUser from "../hooks/user";

interface Question {
  questionText: string;
  options: string[];
  chosenAnswer: number | null;
  correctAnswer: string;
}

interface Quiz {
  quizName: string;
  questions: Question[];
}
interface Quiz {
  quizName: string;
  questions: Question[];
}

const TakeQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("ID");
  const quizId = searchParams.get("quizId");
  const { user, isLoading } = useUser();
  const navigate = useNavigate(); // For redirection


  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
    if (!isLoading && user?.userRole !== "Candidate") {
      // If they are not an candidate, redirect them to home
      window.location.href = "/";
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (jobId !== undefined && quizId !== null) {
      fetchQuiz();
    } else {
    }
  }, [jobId, quizId]);

  // Function to call when fetching quiz
  const fetchQuiz = async () => {
    try {
      console.log(
        `Fetching the quiz with id : ${quizId} for job post with id: ${jobId}`
      );
      const data = { jobId: jobId as string, quizId: quizId as string};
      const response = await getSpecificQuiz(data); // Wait for the promise to resolve
      console.log("successfully received quiz response");
      console.log(response);
      setQuiz(response.quiz);
    } catch (error: any) {
      if (error.status == 409) {
        console.log("Quiz could not be found!");
      } else {
        console.log("Unknown Error occurred when requesting quiz from server");
        console.error(error);
      }
    }
  };

  // Handle radio button change (marking the correct answer)
  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    if (quiz !== null) {
      const newQuestions = quiz.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            chosenAnswer: answerIndex,
            correctAnswer: question.options[answerIndex],
          };
        }
        return question;
      });

      // Create a new quiz object with the updated questions array
      const newQuiz = {
        ...quiz,
        questions: newQuestions,
      };

      // Set the new quiz object in the state
      setQuiz(newQuiz);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting quiz answers");
    const responses: string[] = [];

    if (quiz != null) {
      quiz.questions.map((question, _) => {
        if (question.chosenAnswer !== null)
          responses.push(question.options[question.chosenAnswer]);
        else responses.push("");
      });
    }
    const data = {
      jobId: jobId as string,
      quizId: quizId as string,
      body: {
        responses: responses,
      },
    };
    try {
      await submitQuizResponse(data);
      console.log("Quiz successfully created!");
      const WAIT_TIME = 3000;
      // Show success toast
      toast.success("You successfully submitted quiz answers!", {
        position: "top-center",
        autoClose: WAIT_TIME,
      });

      setTimeout(() => {
        navigate(`/view-job-posting?ID=${jobId}`);
      }, WAIT_TIME);
    } catch (error: any) {
      console.log("Received error when try to send quiz response");
      console.log(error);
      alert(error.message);
    }
  };

  if (isLoading || user?.userRole !== "Candidate") {
    return (
      <div className="mt-5">
        <h1> Loading content</h1>
      </div>
    );
  }

  if (quiz == null) {
    return (
      <div className="mt-5">
        <h1> Loading Quiz</h1>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer aria-label={undefined} />
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">{quiz.quizName}</h2>
          <form onSubmit={handleSubmit}>
            {quiz.questions.map((questionData, questionIndex) => (
              <div
                key={questionIndex}
                className="mb-4 border border-secondary rounded"
              >
                <div className="mb-3">
                  <h3>{questionData.questionText}</h3>
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
                            ></label>
                            <div className="input-group">
                              <div
                                id={`answer-${questionIndex}-${answerIndex}`}
                                className="form-control read-only-input"
                              >
                                {questionData.options[answerIndex]}
                              </div>
                              <div className="input-group-text">
                                <input
                                  type="radio"
                                  name={`correct-answer-${questionIndex}`}
                                  className="form-check-input"
                                  checked={
                                    questionData.chosenAnswer === answerIndex
                                  }
                                  onChange={() =>
                                    handleCorrectAnswerChange(
                                      questionIndex,
                                      answerIndex
                                    )
                                  }
                                />
                                <span className="ms-2">Choose answer</span>
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
            <button type="submit" className="btn btn-primary w-100">
              Submit Quiz Answers
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
