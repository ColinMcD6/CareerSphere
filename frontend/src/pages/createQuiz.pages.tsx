import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../hooks/user.hooks";
import { createQuizForJobPosting } from "../lib/api.lib";

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number | null;
  correctAnswer: string;
}

const CreateQuiz: React.FC = () => {
  // State for quiz name and questions 
  const [quizName, setQuizName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswerIndex: null,
      correctAnswer: "",
    },
  ]);
  // State for search params (job ID). Used to get the job ID from the URL
  const [searchParams] = useSearchParams(); 
  const jobId = searchParams.get("ID"); 

  const navigate = useNavigate(); // For redirection
  const { user, isLoading } = useUser(); // Custom hook to get user data
  const [disableInput, setDisableInput] = useState<boolean>(false);

  /*
  If the user is not logged in, redirect them away from this page
  If the user is not an employer, redirect them to home page.
  This useEffect will run when the component mounts and whenever the user or isLoading state changes.
  */
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
    if (!isLoading && user?.userRole !== "Employer") {
      // If they are not an employer, redirect them to home
      window.location.href = "/";
    }
  }, [user, isLoading]);

  /* Handle question input change
  This function updates the question text for a specific question in the questions state.
  It takes the index of the question and the new value as parameters.
  It creates a new array of questions, updates the question text at the specified index,
  and sets the new questions array in the state.
  */
  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  /*
  Handle answer input change
  This function updates the answer text for a specific question and answer index in the questions state.
  It takes the question index, answer index, and new value as parameters.
  */
  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[answerIndex] = value;
    setQuestions(newQuestions);
  };

  /*
  Handle correct answer change
  This function updates the correct answer index for a specific question in the questions state.
  It takes the question index and answer index as parameters.
  It creates a new array of questions, updates the correct answer index at the specified question index.
  */
  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswerIndex = answerIndex;
    newQuestions[questionIndex].correctAnswer =  newQuestions[questionIndex].options[answerIndex];
    setQuestions(newQuestions);
  };

  /*
  Handle form submission
  This function is called when the user submits the form.
  It checks if all questions and answers are filled in, and if a correct answer is selected for each question.
  */
  const handleSubmit = async (e: React.FormEvent) => {
    setDisableInput(true);
    e.preventDefault();

    // For each question, check if the question text is filled in
    for (let i = 0; i < questions.length; i++) {
      const {
        questionText: question,
        options: answers,
        correctAnswerIndex,
      } = questions[i];
      if (!question.trim()) {
        alert(`Please enter a question for Question ${i + 1}.`);
        setDisableInput(false);
        return;
      }
      if (answers.some((answer) => !answer.trim())) {
        alert(`Please fill in all answer fields for Question ${i + 1}.`);
        setDisableInput(false);
        return;
      }
      if (correctAnswerIndex === null) {
        alert(`Please mark the correct answer for Question ${i + 1}.`);
        setDisableInput(false);
        return;
      }
    }

    // Check if quiz name is empty
    if (questions.length <= 0) {
      alert("Must have at least one question!");
      setDisableInput(false);
      return;
    }

    // Check if jobId is not null such that we can create a quiz for the job posting
    if (jobId !== null) {
      console.log("Sending a create quiz request to backend");

     const questionSubmit : Question[] = [...questions]
      for ( const question of questionSubmit)
        if (question.correctAnswerIndex !== null)
          question.correctAnswer = question.options[question.correctAnswerIndex];

      const data = {
        jobId: jobId,
        body: {
          questions: questionSubmit,
          quizName: quizName,
        },
      };
      setQuestions(questionSubmit);
      try {
        await createQuizForJobPosting(data);
        console.log("Quiz successfully created!");
        const WAIT_TIME = 4500;
        // Show success toast
        toast.success("Quiz successfully created and added to job posting!", {
          position: "top-center",
          autoClose: WAIT_TIME,
        });

        setTimeout(() => {
          navigate(`/view-job-posting?ID=${jobId}`);
        }, WAIT_TIME);
      } catch (error: any) {
        setDisableInput(false);
        console.log("Received an error from server");
        console.log(error);
        alert(error.message);
      }
    }
  };


  /*
  Delete a question at a specific index
  This function filters out the question at the specified index from the questions state.
  It creates a new array of questions without the question at the specified index and sets the new questions array in the state.
  It is called when the user clicks the delete button for a question.
  */
  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index); // Return all questions that are not index
    setQuestions(newQuestions);
  };

  /*
  Add a new question to the questions state
  This function creates a new question object with empty values and adds it to the questions state.
  It creates a new array of questions with the new question object and sets the new questions array in the state.
  */
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

  if (isLoading || user?.userRole !== "Employer") {
    return <div> Loading content</div>;
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
                disabled={disableInput}
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
                <div className="mb-3 clearfix p-4">
                  <label
                    htmlFor={`question-${questionIndex}`}
                    className="form-label mb-2 display-6"
                  >
                    Question {questionIndex + 1}
                  </label>
                  <button
                    disabled={disableInput}
                    type="button"
                    className="btn btn-link text-danger float-end"
                    onClick={() => deleteQuestion(questionIndex)}
                    style={{ fontSize: "1.25rem", lineHeight: "1" }}
                  >
                    <i className="bi bi-trash "></i>
                  </button>
                  <input
                    disabled={disableInput}
                    type="text"
                    id={`question-${questionIndex}`}
                    className="form-control text-center "
                    value={questionData.questionText}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, e.target.value)
                    }
                    placeholder={`Enter question ${questionIndex + 1}`}
                    required
                  />
                </div>
                <div className="row p-4">
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
                                disabled={disableInput}
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
                                  required
                                  disabled={disableInput}
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
              disabled={disableInput}
            >
              Add Another Question
            </button>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={disableInput}
            >
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
