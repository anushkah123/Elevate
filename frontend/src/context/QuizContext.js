import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizConfig, setQuizConfig]   = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [answers, setAnswers]         = useState({});
  const [results, setResults]         = useState(null);
  const [history, setHistory]         = useState([]);

  const resetQuiz = () => {
    setQuizConfig(null);
    setQuestions([]);
    setAnswers({});
    setResults(null);
  };

  const saveResult = (result) => {
    setResults(result);
    setHistory((prev) => [result, ...prev].slice(0, 20));
  };

  return (
    <QuizContext.Provider value={{
      quizConfig, setQuizConfig,
      questions,  setQuestions,
      answers,    setAnswers,
      results,    saveResult,
      history,
      resetQuiz,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
