import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuiz } from '../context/QuizContext';

export default function Results() {
  const navigate = useNavigate();
  const { results, resetQuiz } = useQuiz();

  if (!results) { navigate('/'); return null; }

  const { topic, score, total, pct, questions, answers } = results;

  const strong = [], weak = [];
  questions.forEach((q, i) => {
    (answers[i] === q.correctAnswer ? strong : weak).push(q.topic || q.question.slice(0, 30));
  });

  const conicPct = `${pct}% ${pct}% 100%`;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title" style={{ textAlign: 'center' }}>Quiz complete!</h1>
        <p className="page-sub" style={{ textAlign: 'center' }}>Here's how you did on {topic}</p>

        <div className="quiz-card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            className="score-circle-wrap"
            style={{ '--score-pct': `${pct}%` }}
          >
            <div className="score-circle-inner">
              <span className="score-number">{pct}%</span>
              <span className="score-sub-label">Score</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--text-dark)', display: 'block' }}>{score}/{total}</span>
              <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Correct</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--lilac-600)', display: 'block' }}>+{score * 5}pts</span>
              <span style={{ fontSize: 12, color: 'var(--text-light)' }}>XP earned</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--text-dark)', display: 'block' }}>{pct >= 80 ? '🏅' : pct >= 50 ? '👍' : '📚'}</span>
              <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{pct >= 80 ? 'Mastered' : pct >= 50 ? 'Good' : 'Keep going'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {strong.slice(0, 3).map((s, i) => <span key={i} className="chip chip-strong">✓ {s}</span>)}
            {weak.slice(0, 3).map((w, i)   => <span key={i} className="chip chip-weak">✗ {w}</span>)}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-mid)', marginBottom: '1rem' }}>Answer breakdown</h3>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correctAnswer;
            return (
              <div key={i} style={{
                border: `1px solid ${correct ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 8,
                background: correct ? '#f0fdf4' : '#fef2f2',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 4 }}>
                  {i + 1}. {q.question}
                </div>
                <div style={{ fontSize: 12, color: correct ? '#15803d' : '#b91c1c' }}>
                  {correct ? '✓ Correct' : `✗ Your answer: ${answers[i] || 'skipped'}`}
                </div>
                {!correct && (
                  <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>Correct: {q.correctAnswer}</div>
                )}
                {q.explanation && (
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6, fontStyle: 'italic' }}>{q.explanation}</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/practice')}>
            Practice weak areas
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { resetQuiz(); navigate('/create'); }}>
            New quiz
          </button>
        </div>
      </div>
    </>
  );
}
