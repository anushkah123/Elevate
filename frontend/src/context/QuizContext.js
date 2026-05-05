import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);

  const saveResult = (result) => {
    setQuizResults(result);
    setHistory(h => [result, ...h].slice(0, 20));
  };

  return (
    <QuizContext.Provider value={{
      currentQuiz, setCurrentQuiz,
      quizResults, setQuizResults, saveResult,
      history,
      adaptiveQuestions, setAdaptiveQuestions,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
