import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { CheckCircle, XCircle, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

function ShortAnswerInput({ question, onAnswer, answered, userAnswer }) {
  const [val, setVal] = useState('');
  if (answered) return (
    <div>
      <div className="form-input mb-1" style={{ background: 'var(--bg-secondary)' }}>{userAnswer}</div>
      <div className="alert alert-info"><strong>Expected:</strong> {question.correctAnswer}</div>
    </div>
  );
  return (
    <div className="flex gap-1">
      <input className="form-input" placeholder="Type your answer..." value={val} onChange={e => setVal(e.target.value)} />
      <button className="btn btn-primary" onClick={() => { if (val.trim()) onAnswer(val.trim()); }}>Submit</button>
    </div>
  );
}

export default function Quiz() {
  const navigate = useNavigate();
  const { currentQuiz, saveResult } = useQuiz();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => { if (!currentQuiz) navigate('/create'); }, [currentQuiz, navigate]);

  const q = currentQuiz?.questions?.[idx];
  const answered = answers[idx] !== undefined;

  const handleAnswer = useCallback((ans) => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [idx]: ans }));
    setShowExplanation(true);
  }, [answered, idx]);

  // Timer
  useEffect(() => {
    if (answered) return;
    setTimeLeft(30);
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleAnswer('__timeout__'); clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [idx, answered, handleAnswer]);

  const handleNext = () => {
    setShowExplanation(false);
    if (idx + 1 >= currentQuiz.questions.length) {
      // Calculate results
      let correct = 0;
      const subtopicMap = {};
      currentQuiz.questions.forEach((qq, i) => {
        const ua = answers[i] || '';
        const isCorrect = qq.type === 'shortanswer'
          ? ua.toLowerCase().includes(qq.correctAnswer.toLowerCase().slice(0, 8))
          : ua === qq.correctAnswer;
        if (isCorrect) correct++;
        if (!subtopicMap[qq.subtopic]) subtopicMap[qq.subtopic] = { correct: 0, total: 0 };
        subtopicMap[qq.subtopic].total++;
        if (isCorrect) subtopicMap[qq.subtopic].correct++;
      });

      const result = {
        quiz: currentQuiz,
        answers,
        correct,
        total: currentQuiz.questions.length,
        score: Math.round((correct / currentQuiz.questions.length) * 100),
        subtopics: subtopicMap,
        date: new Date().toISOString(),
        topic: currentQuiz.topic,
        difficulty: currentQuiz.difficulty,
      };
      saveResult(result);
      navigate('/results');
    } else {
      setIdx(i => i + 1);
    }
  };

  if (!currentQuiz || !q) return <div className="container-sm"><div className="spinner" /></div>;

  const isCorrect = answered && (q.type === 'shortanswer'
    ? answers[idx]?.toLowerCase().includes(q.correctAnswer.toLowerCase().slice(0, 8))
    : answers[idx] === q.correctAnswer);
  const progress = ((idx + 1) / currentQuiz.questions.length) * 100;

  return (
    <div className="page">
      <div className="container-sm">
        {/* Progress */}
        <div className="flex items-center justify-between mb-2 mt-2">
          <span className="text-secondary text-sm">Question {idx + 1} of {currentQuiz.questions.length}</span>
          <div className="flex items-center gap-1">
            <Clock size={14} style={{ color: timeLeft <= 5 ? 'var(--danger)' : 'var(--text-secondary)' }} />
            <span style={{ fontWeight: 700, color: timeLeft <= 5 ? 'var(--danger)' : 'var(--text)', minWidth: 24 }}>{timeLeft}s</span>
          </div>
        </div>
        <div className="progress-bar mb-3">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="card fade-in" key={idx}>
          {/* Subtopic chip */}
          {q.subtopic && <span className="chip chip-purple mb-2">{q.subtopic}</span>}

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.4 }}>
            {q.question}
          </h2>

          {/* Options */}
          <div className="flex-col gap-1 mb-2">
            {q.type === 'shortanswer' ? (
              <ShortAnswerInput question={q} onAnswer={handleAnswer} answered={answered} userAnswer={answers[idx]} />
            ) : (
              (q.options || []).map((opt, oi) => {
                let cls = 'option-btn';
                if (answered) {
                  if (opt === q.correctAnswer) cls += ' correct';
                  else if (opt === answers[idx] && opt !== q.correctAnswer) cls += ' incorrect';
                } else if (answers[idx] === opt) cls += ' selected';

                return (
                  <button key={oi} className={cls} onClick={() => handleAnswer(opt)} disabled={answered}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--bg-secondary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                    {answered && opt === q.correctAnswer && <CheckCircle size={16} style={{ marginLeft: 'auto', color: 'var(--success)' }} />}
                    {answered && opt === answers[idx] && opt !== q.correctAnswer && <XCircle size={16} style={{ marginLeft: 'auto', color: 'var(--danger)' }} />}
                  </button>
                );
              })
            )}
          </div>

          {/* Timeout notice */}
          {answers[idx] === '__timeout__' && (
            <div className="alert alert-error flex items-center gap-1 mb-2">
              <AlertTriangle size={16} /> Time's up! The correct answer was: <strong>{q.correctAnswer}</strong>
            </div>
          )}

          {/* Result feedback */}
          {answered && answers[idx] !== '__timeout__' && (
            <div className={`alert ${isCorrect ? 'alert-success' : 'alert-error'} flex items-center gap-1 mb-2`}>
              {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {isCorrect ? 'Correct!' : `Incorrect. Answer: ${q.correctAnswer}`}
            </div>
          )}

          {/* Explanation */}
          {showExplanation && q.explanation && (
            <div className="alert alert-info mb-2">
              💡 <strong>Explanation:</strong> {q.explanation}
            </div>
          )}

          {answered && (
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNext}>
              {idx + 1 >= currentQuiz.questions.length ? 'View Results' : 'Next Question'} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
