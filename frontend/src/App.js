import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Landing from './pages/Landing';
import CreateQuiz from './pages/CreateQuiz';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import AdaptivePractice from './pages/AdaptivePractice';

export default function App() {
  return (
    <QuizProvider>
      <BrowserRouter basename="/Elevate">
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/create"    element={<CreateQuiz />} />
          <Route path="/quiz"      element={<Quiz />} />
          <Route path="/results"   element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice"  element={<AdaptivePractice />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}
