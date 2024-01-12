
import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../Styles/Results.module.css';

function Results() {
    const location = useLocation();
    const { totalQuestions, totalCorrect, totalIncorrect, correctAnswers } = location.state;

    return (
        <div className={styles.results_container}>
            <h2 className={styles.results_heading}>Results</h2>
            <p className={styles.results_text}>Total Questions Served: {totalQuestions}</p>
            <p className={styles.results_text}>Total Correct Questions: {totalCorrect}</p>
            <p className={styles.results_text}>Total Incorrect Questions: {totalIncorrect}</p>

            <h3 className={styles.individual_heading}>Correct Answer</h3>
            <ul className={styles.individual_results_list}>
                {correctAnswers.map((question: any, index: number) => (
                    <li key={index} className={styles.individual_result_item}>
                        Question {index + 1}: {question.correctAnswer}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Results;
