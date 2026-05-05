import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import CreateQuiz from './pages/CreateQuiz';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Adaptive from './pages/Adaptive';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <QuizProvider>
        <BrowserRouter basename="/Elevate">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/adaptive" element={<Adaptive />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </QuizProvider>
    </ThemeProvider>
  );
}
