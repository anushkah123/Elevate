import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuiz } from '../context/QuizContext';

export default function Quiz() {
  const navigate = useNavigate();
  const { questions, answers, setAnswers, saveResult, quizConfig } = useQuiz();
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!questions.length) { navigate('/create'); return; }
  }, [questions, navigate]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const q = questions[current];
  if (!q) return null;

  const selectAnswer = (opt) => setAnswers((prev) => ({ ...prev, [current]: opt }));

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
      saveResult({
        topic: quizConfig?.topic || 'Quiz',
        score: correct,
        total: questions.length,
        pct: Math.round((correct / questions.length) * 100),
        answers,
        questions,
        date: new Date().toISOString(),
      });
      navigate('/results');
    }
  };

  const pct = Math.round(((current) / questions.length) * 100);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Question {current + 1} of {questions.length}</span>
          <span className="timer">{mins}:{secs}</span>
        </div>

        <div className="progress-bar" style={{ marginBottom: '2rem' }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="quiz-card">
          <span className="quiz-q-num">Question {current + 1}</span>
          <div className="quiz-question">{q.question}</div>

          {q.options?.map((opt, i) => (
            <button
              key={i}
              className={`option-btn${answers[current] === opt ? ' selected' : ''}`}
              onClick={() => selectAnswer(opt)}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}

          {q.type === 'short_answer' && (
            <textarea
              className="form-textarea"
              placeholder="Type your answer…"
              value={answers[current] || ''}
              onChange={(e) => selectAnswer(e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleNext}
          style={{ padding: '14px', fontSize: 15, justifyContent: 'center' }}
        >
          {current < questions.length - 1 ? 'Next question →' : 'Submit quiz →'}
        </button>
      </div>
    </>
  );
}
