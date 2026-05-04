import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuiz } from '../context/QuizContext';
import { generateQuiz } from '../services/api';

export default function AdaptivePractice() {
  const navigate = useNavigate();
  const { results, setQuizConfig, setQuestions } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const weakTopics = results
    ? results.questions
        .filter((q, i) => results.answers[i] !== q.correctAnswer)
        .map((q) => q.topic || results.topic)
        .filter((v, i, a) => a.indexOf(v) === i)
    : [];

  const handlePractice = async () => {
    if (!weakTopics.length) return;
    setLoading(true);
    setError('');
    try {
      const topic = weakTopics.join(', ');
      const payload = { topic, type: 'Multiple choice', difficulty: 'Medium', count: 5 };
      setQuizConfig(payload);
      const res = await generateQuiz(payload);
      setQuestions(res.data.questions);
      navigate('/quiz');
    } catch {
      setError('Could not generate practice questions. Check your backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Adaptive practice</h1>
        <p className="page-sub">AI-targeted questions based on your weak spots</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, marginBottom: '1.5rem', fontSize: 14 }}>
            {error}
          </div>
        )}

        {weakTopics.length > 0 ? (
          <>
            <div className="quiz-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-mid)', marginBottom: '1rem' }}>Weak areas detected</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {weakTopics.map((t, i) => (
                  <span key={i} className="chip chip-weak">✗ {t}</span>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Weakness meter</span>
                  <span style={{ color: 'var(--text-light)' }}>{weakTopics.length} areas</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(weakTopics.length * 25, 100)}%`,
                      background: 'linear-gradient(90deg, #fca5a5, #ef4444)',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handlePractice}
              disabled={loading}
              style={{ padding: '14px', fontSize: 15, justifyContent: 'center' }}
            >
              {loading ? 'Generating practice…' : 'Start targeted practice →'}
            </button>
          </>
        ) : (
          <div style={{
            background: 'var(--lilac-50)',
            border: '1px dashed var(--lilac-300)',
            borderRadius: 16,
            padding: '3rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: '1rem' }}>🎯</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-mid)', marginBottom: 8 }}>
              {results ? 'No weak areas — great job!' : 'Take a quiz first'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              {results
                ? 'You answered everything correctly. Take another quiz to find new areas to improve.'
                : 'Complete a quiz and we\'ll identify exactly what to practice.'}
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/create')}>
              {results ? 'Take another quiz →' : 'Create a quiz →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
