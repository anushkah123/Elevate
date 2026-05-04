import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { generateAdaptive } from '../services/api';
import { Target, CheckCircle, XCircle, Star, AlertCircle } from 'lucide-react';

export default function Adaptive() {
  const navigate = useNavigate();
  const { quizResults, setAdaptiveQuestions } = useQuiz();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!quizResults) { navigate('/create'); return; }
    const weak = Object.entries(quizResults.subtopics)
      .filter(([, v]) => v.correct / v.total < 0.6)
      .map(([k]) => k);
    if (!weak.length) { navigate('/results'); return; }

    generateAdaptive({ weakTopics: weak, originalTopic: quizResults.topic, difficulty: quizResults.difficulty })
      .then(res => { setQuestions(res.data.questions || []); })
      .catch(err => setError(err.response?.data?.error || 'Failed to load practice questions.'))
      .finally(() => setLoading(false));
  }, [quizResults, navigate]);

  const handleAnswer = (idx, ans) => {
    if (answers[idx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [idx]: ans }));
  };

  const score = Object.entries(answers).filter(([i, a]) => a === questions[+i]?.correctAnswer).length;
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  if (loading) return (
    <div className="container-sm text-center" style={{ paddingTop: '3rem' }}>
      <div className="spinner" />
      <p className="text-secondary">Generating targeted practice with NVIDIA NIM...</p>
    </div>
  );

  if (error) return (
    <div className="container-sm">
      <div className="alert alert-error flex items-center gap-1"><AlertCircle size={16} />{error}</div>
      <button className="btn btn-ghost" onClick={() => navigate('/results')}>← Back to Results</button>
    </div>
  );

  return (
    <div className="page">
      <div className="container-sm">
        <div className="fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
                <Target size={24} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)', verticalAlign: 'middle' }} />
                Adaptive Practice
              </h1>
              <p className="text-secondary text-sm">Targeted questions for your weak areas</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/results')}>← Results</button>
          </div>

          {allAnswered && (
            <div className="card mb-3 text-center" style={{
              background: score / questions.length >= 0.8
                ? 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.1))'
                : 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.1))',
              border: `2px solid ${score / questions.length >= 0.8 ? 'var(--success)' : 'var(--warning)'}`,
            }}>
              {score / questions.length >= 0.8 ? (
                <>
                  <Star size={32} style={{ color: 'var(--warning)', marginBottom: 8 }} />
                  <h3 style={{ color: 'var(--success)' }}>Topic Mastered! 🎉</h3>
                  <p className="text-secondary">You scored {score}/{questions.length} on your weak areas!</p>
                </>
              ) : (
                <>
                  <h3 style={{ color: 'var(--warning)' }}>Keep Practicing! Score: {score}/{questions.length}</h3>
                  <p className="text-secondary">Review the explanations below and try again.</p>
                </>
              )}
            </div>
          )}

          <div className="flex-col gap-2">
            {questions.map((q, idx) => {
              const ua = answers[idx];
              const isCorrect = ua === q.correctAnswer;
              return (
                <div key={idx} className="card fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="chip chip-purple">{q.subtopic}</span>
                    {ua !== undefined && (
                      isCorrect
                        ? <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                        : <XCircle size={20} style={{ color: 'var(--danger)' }} />
                    )}
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q.question}</p>
                  <div className="flex-col gap-1 mb-2">
                    {(q.options || []).map((opt, oi) => {
                      let cls = 'option-btn';
                      if (ua !== undefined) {
                        if (opt === q.correctAnswer) cls += ' correct';
                        else if (opt === ua && opt !== q.correctAnswer) cls += ' incorrect';
                      }
                      return (
                        <button key={oi} className={cls} onClick={() => handleAnswer(idx, opt)} disabled={ua !== undefined}>
                          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {ua !== undefined && q.explanation && (
                    <div className="alert alert-info text-sm">💡 {q.explanation}</div>
                  )}
                </div>
              );
            })}
          </div>

          {allAnswered && (
            <div className="flex gap-1 mt-3">
              <button className="btn btn-primary flex-1" onClick={() => { setAnswers({}); window.scrollTo(0, 0); }}>
                Try Again
              </button>
              <button className="btn btn-ghost flex-1" onClick={() => navigate('/create')}>
                New Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
