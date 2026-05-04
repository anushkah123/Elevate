import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuiz } from '../context/QuizContext';
import { generateQuiz } from '../services/api';

const TYPES = ['Multiple choice', 'True / False', 'Short answer', 'Mixed'];
const COUNTS = [5, 10, 15, 20];

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { setQuizConfig, setQuestions } = useQuiz();

  const [topic, setTopic]         = useState('');
  const [type, setType]           = useState('Multiple choice');
  const [difficulty, setDiff]     = useState('Medium');
  const [count, setCount]         = useState(10);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic.'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = { topic, type, difficulty, count };
      setQuizConfig(payload);
      const res = await generateQuiz(payload);
      setQuestions(res.data.questions);
      navigate('/quiz');
    } catch (err) {
      setError('Failed to generate quiz. Check your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Create a quiz</h1>
        <p className="page-sub">Tell the AI what you want to learn about</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, marginBottom: '1.5rem', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div className="form-card">
          <label className="form-label">Topic or subject</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Photosynthesis, World War II, JavaScript closures…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>

        <div className="form-card">
          <div className="form-group">
            <label className="form-label">Question type</label>
            <div className="pill-group">
              {TYPES.map((t) => (
                <button key={t} className={`pill${type === t ? ' active' : ''}`} onClick={() => setType(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <div className="difficulty-track">
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <button key={d} className={`diff-btn${difficulty === d ? ' active' : ''}`} onClick={() => setDiff(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Number of questions</label>
            <div className="pill-group">
              {COUNTS.map((n) => (
                <button key={n} className={`pill${count === n ? ' active' : ''}`} onClick={() => setCount(n)}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '14px', fontSize: 15, justifyContent: 'center' }}
        >
          {loading ? 'Generating…' : 'Generate quiz with AI →'}
        </button>
      </div>
    </>
  );
}
