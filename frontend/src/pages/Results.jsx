import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { saveQuiz } from '../services/api';
import { Trophy, RefreshCw, Target, BookOpen, ChevronRight, RotateCcw } from 'lucide-react';

function Flashcard({ question, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flashcard-scene" onClick={() => setFlipped(f => !f)}>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="flashcard-face flashcard-front">
          <div className="chip chip-purple mb-2">Q {index + 1}</div>
          <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>{question.question}</p>
          <p className="text-secondary text-sm mt-2">Click to reveal answer</p>
        </div>
        <div className="flashcard-face flashcard-back">
          <div className="chip mb-2" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Answer</div>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{question.correctAnswer}</p>
          {question.explanation && <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>{question.explanation}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { quizResults } = useQuiz();
  const { user } = useAuth();
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [fcIdx, setFcIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (quizResults && user && !saved) {
      const persistResults = async () => {
        try {
          await saveQuiz({
            title: quizResults.quiz.title,
            topic: quizResults.topic,
            difficulty: quizResults.difficulty,
            questions: quizResults.quiz.questions,
            score: quizResults.score,
            totalQuestions: quizResults.total
          });
          setSaved(true);
        } catch (err) {
          console.error('Failed to save quiz results:', err);
        }
      };
      persistResults();
    }
  }, [quizResults, user, saved]);

  if (!quizResults) {
    return (
      <div className="container-sm text-center" style={{ paddingTop: '4rem' }}>
        <p className="text-secondary mb-2">No results found.</p>
        <Link to="/create" className="btn btn-primary">Create a Quiz</Link>
      </div>
    );
  }

  const { score, correct, total, subtopics, quiz } = quizResults;
  const weakTopics = Object.entries(subtopics)
    .filter(([, v]) => v.correct / v.total < 0.6)
    .map(([k]) => k);

  const getGrade = (s) => {
    if (s >= 90) return { label: 'Excellent! 🏆', color: 'var(--success)' };
    if (s >= 70) return { label: 'Good job! 👍', color: 'var(--accent)' };
    if (s >= 50) return { label: 'Keep going! 💪', color: 'var(--warning)' };
    return { label: 'Need practice 📚', color: 'var(--danger)' };
  };
  const grade = getGrade(score);

  if (flashcardMode) {
    const questions = quiz.questions;
    return (
      <div className="page">
        <div className="container-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontFamily: 'Syne', fontWeight: 700 }}>Flashcard Mode</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setFlashcardMode(false)}>← Back to Results</button>
          </div>
          <Flashcard question={questions[fcIdx]} index={fcIdx} />
          <div className="flex items-center justify-between mt-3">
            <button className="btn btn-ghost" onClick={() => setFcIdx(i => Math.max(0, i - 1))} disabled={fcIdx === 0}>← Prev</button>
            <span className="text-secondary">{fcIdx + 1} / {questions.length}</span>
            <button className="btn btn-ghost" onClick={() => setFcIdx(i => Math.min(questions.length - 1, i + 1))} disabled={fcIdx === questions.length - 1}>Next →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container-sm">
        <div className="fade-in">
          <div className="card text-center mb-3" style={{ padding: '2.5rem' }}>
            <div className="score-circle mb-2" style={{ '--pct': score }}>
              <div className="score-circle-inner">
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne', color: 'var(--primary)' }}>{score}%</div>
                <div className="text-secondary text-sm">{correct}/{total}</div>
              </div>
            </div>
            <h2 style={{ fontFamily: 'Syne', fontSize: '1.5rem', marginBottom: '0.5rem', color: grade.color }}>{grade.label}</h2>
            <p className="text-secondary">Topic: <strong>{quizResults.topic}</strong> · Difficulty: <strong style={{ textTransform: 'capitalize' }}>{quizResults.difficulty}</strong></p>
          </div>

          <div className="card mb-3">
            <h3 style={{ marginBottom: '1rem' }}>📊 Topic Breakdown</h3>
            {Object.entries(subtopics).map(([topic, { correct: c, total: t }]) => {
              const pct = Math.round((c / t) * 100);
              return (
                <div key={topic} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold">{topic}</span>
                    <span className="text-sm text-secondary">{c}/{t} — {pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct >= 70 ? 'linear-gradient(90deg,var(--success),#34d399)' :
                        pct >= 50 ? 'linear-gradient(90deg,var(--warning),#fbbf24)' :
                          'linear-gradient(90deg,var(--danger),#f87171)',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card mb-3">
            <div className="grid-2">
              <div>
                <h4 className="mb-1 text-success">✅ Strong Areas</h4>
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(subtopics).filter(([, v]) => v.correct / v.total >= 0.6).map(([k]) => (
                    <span key={k} className="chip chip-green">{k}</span>
                  ))}
                  {Object.entries(subtopics).filter(([, v]) => v.correct / v.total >= 0.6).length === 0 && <span className="text-secondary text-sm">None yet</span>}
                </div>
              </div>
              <div>
                <h4 className="mb-1 text-danger">⚠️ Needs Work</h4>
                <div className="flex gap-1 flex-wrap">
                  {weakTopics.map(k => <span key={k} className="chip chip-red">{k}</span>)}
                  {weakTopics.length === 0 && <span className="text-secondary text-sm">Great job!</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-col gap-1">
            {weakTopics.length > 0 && (
              <button className="btn btn-primary" onClick={() => navigate('/adaptive')}>
                <Target size={16} /> Practice Weak Areas ({weakTopics.length} topics) <ChevronRight size={16} />
              </button>
            )}
            <button className="btn btn-outline" onClick={() => setFlashcardMode(true)}>
              <BookOpen size={16} /> Flashcard Mode
            </button>
            <Link to="/create" className="btn btn-ghost">
              <RefreshCw size={16} /> New Quiz
            </Link>
            <Link to="/dashboard" className="btn btn-ghost">
              <RotateCcw size={16} /> View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
