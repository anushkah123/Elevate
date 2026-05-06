import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getQuizHistory } from '../services/api';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const { user } = useAuth();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);

  // Fetch history from DB when user changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const res = await getQuizHistory();
          // Normalize data from DB to match frontend expected format
          const formattedHistory = res.data.quizzes.map(q => ({
            topic: q.topic,
            score: q.score,
            total: q.totalQuestions,
            correct: Math.round((q.score / 100) * q.totalQuestions),
            difficulty: q.difficulty,
            date: q.createdAt,
            quiz: q // Store the whole object for detailed view
          }));
          setHistory(formattedHistory);
        } catch (err) {
          console.error('Failed to fetch quiz history:', err);
        }
      } else {
        setHistory([]);
      }
    };
    fetchHistory();
  }, [user]);

  const saveResult = (result) => {
    setQuizResults(result);
    // Locally add to history for immediate feedback
    setHistory(h => [result, ...h]);
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
