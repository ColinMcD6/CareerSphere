import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getSpecificQuiz, submitQuizResponse } from "../lib/api.lib";
import { useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add useNavigate for redirection
import useUser from "../hooks/user.hooks";

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


  /*
  useEffect to check if the user is logged in and has the correct role
  This will run when the component mounts and whenever the user object changes.
  If the user is not logged in or does not have the correct role, they will be redirected to the login page.
  */
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

  /*
  Function to fetch the quiz data from the server
  This function is called when the component mounts and whenever the jobId or quizId changes.
  It calls the getSpecificQuiz function with the jobId and quizId as parameters.
  If the request is successful, it sets the quiz state with the received data.
  If the request fails, it logs an error message to the console.
  */
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

  /*
  Handler function for changing the correct answer
  This function is called when the user selects an answer for a question.
  It updates the quiz state with the selected answer and the correct answer for that question.
  It maps through the questions array and updates the chosenAnswer and correctAnswer properties for the selected question.
  It creates a new quiz object with the updated questions array and sets it in the state.
  This ensures that the quiz state is updated correctly without mutating the original state.  
  */
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

  /*
  Handler function for form submission
  This function prevents the default form submission behavior,
  collects the user's answers from the quiz state,
  and sends them to the server using the submitQuizResponse function.
  If the request is successful, it shows a success toast message and redirects the user to the job posting page.
  If there is an error, it alerts the user with the error message.
  This function is called when the user clicks the "Submit Quiz Answers" button.
  */
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
              <fieldset
                key={questionIndex}
                className={`mb-4 border rounded ${
                  questionData.chosenAnswer === null ? "border-danger" : "border-secondary"
                }`}
                aria-labelledby={`question-${questionIndex}`}
              >
                <legend id={`question-${questionIndex}`} className="mb-3">
                  <h3>{questionData.questionText}</h3>
                </legend>
                {questionData.chosenAnswer === null && (
                  <p className="text-danger">Please select an answer for this question.</p>
                )}
                <div className="row">
                  {questionData.options.map((option, answerIndex) => (
                    <div key={answerIndex} className="col-12 col-md-6 col-lg-4 mb-3">
                      <div
                        className={`card ${
                          questionData.chosenAnswer === answerIndex ? "border-primary" : "border-secondary"
                        }`}
                        onClick={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleCorrectAnswerChange(questionIndex, answerIndex);
                          }
                        }}
                        tabIndex={0}
                        role="radio"
                        aria-checked={questionData.chosenAnswer === answerIndex}
                        style={{
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          height: "40px",
                          maxWidth: "200px",
                          margin: "0 auto",
                          alignItems: "center",
                        }}
                      >
                        <div className="card-body d-flex align-items-center p-2">
                          <input
                            required
                            type="radio"
                            name={`correct-answer-${questionIndex}`}
                            className="form-check-input me-2"
                            checked={questionData.chosenAnswer === answerIndex}
                            onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                            aria-label={`Option ${answerIndex + 1}: ${option}`}
                          />
                          <span>{option}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
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
