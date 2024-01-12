import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Home.module.css';

const apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results) {
        const transformedQuestions: Question[] = data.results.map((questionData: any) => ({
          question: questionData.question,
          options: [...questionData.incorrect_answers, questionData.correct_answer],
          correctAnswer: questionData.correct_answer,
          explanation: questionData.explanation,
        }));

        setQuestions(transformedQuestions);
        setCorrectAnswers(Array(transformedQuestions.length).fill(false)); 
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelection = (selectedAnswer: string) => {
    if (!userAnswer && !showNextButton) {
      setUserAnswer(selectedAnswer);
      setShowNextButton(true);
    }
  };

  const handleAnswerSubmission = () => {
    const trimmedUserAnswer = userAnswer.trim().toLowerCase();
    const trimmedCorrectAnswer = currentQuestion?.correctAnswer.trim().toLowerCase();

    if (trimmedUserAnswer === trimmedCorrectAnswer) {
      setCorrectAnswers((prevCorrectness) => {
        const updatedCorrectness = [...prevCorrectness];
        updatedCorrectness[currentQuestionIndex] = true;
        return updatedCorrectness;
      });
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setShowNextButton(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserAnswer('');
    } else {
      navigate('/results', {
        state: {
          totalQuestions: questions.length,
          totalCorrect: correctAnswers.filter(Boolean).length,
          totalIncorrect: correctAnswers.filter((correct) => !correct).length,
          correctAnswers: questions, 
        },
      });
    }
  };

  return (
    <div className={styles.triviagame_container}>
      {currentQuestion ? (
        <>
          <h1 className={styles.triviaquestion}>{currentQuestion.question}</h1>
          <ul className={styles.options_list}>
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleAnswerSelection(option)}
                className={styles.option_item}
              >
                {option}
              </li>
            ))}
          </ul>
          {userAnswer && !showNextButton && (
            <button onClick={handleAnswerSubmission} className={styles.submitbutton}>
              Submit Answer
            </button>
          )}
          {showExplanation && (
            <div className={styles.explanation_container}>
              {userAnswer !== currentQuestion.correctAnswer && (
                <>
                  <p className={styles.wrong_answer}>
                    Wrong! Correct answer: {currentQuestion.correctAnswer}
                  </p>
                  <p className={styles.explanation_text}>
                    Explanation: {currentQuestion.explanation}
                  </p>
                </>
              )}
              {userAnswer === currentQuestion.correctAnswer && (
                <p className={styles.correct_answer}>
                  Correct! The answer is {currentQuestion.correctAnswer}.
                </p>
              )}
            </div>
          )}
          {userAnswer && !showExplanation && (
            <div className={styles.useranswer_container}>
              <p className={styles.useranswer}>Your answer: {userAnswer}</p>
              <p className={correctAnswers[currentQuestionIndex] ? styles.correct : styles.incorrect}>
                {correctAnswers[currentQuestionIndex] ? 'Correct!' : 'Wrong!'}
              </p>
            </div>
          )}
          {showNextButton && !showExplanation && (
            <button onClick={handleNextQuestion} className={styles.nextbutton}>
              Next Question
            </button>
          )}
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}

export default Home;
