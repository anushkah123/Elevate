import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { generateQuiz } from '../services/api';
import { Brain, Upload, X, Zap, AlertCircle } from 'lucide-react';

const FORMATS = [
  { id: 'mcq', label: 'Multiple Choice', desc: '4 options per question' },
  { id: 'truefalse', label: 'True / False', desc: 'Binary answer format' },
  { id: 'shortanswer', label: 'Short Answer', desc: 'Open-ended responses' },
  { id: 'mixed', label: 'Mixed', desc: 'Combination of all types' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { setCurrentQuiz } = useQuiz();
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('mcq');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(10);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setFileContent(text.slice(0, 5000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) { setError('Please enter a topic.'); return; }
    setLoading(true); setError('');
    try {
      const res = await generateQuiz({ topic, questionCount: count, difficulty, format, fileContent: fileContent || undefined });
      setCurrentQuiz({ ...res.data.quiz, settings: { topic, difficulty, format, count } });
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container-sm">
        <div className="fade-in">
          <div className="text-center mb-4">
            <h1 className="section-title" style={{ fontSize: '2rem' }}>
              <Brain size={28} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)', verticalAlign: 'middle' }} />
              Create Your Quiz
            </h1>
            <p className="section-subtitle">Powered by NVIDIA NIM LLaMA 3.3 70B</p>
          </div>

          {error && (
            <div className="alert alert-error flex items-center gap-1">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card mb-3">
              <h3 style={{ marginBottom: '1rem' }}>📚 Topic</h3>
              <div className="form-group">
                <label className="form-label">What do you want to be quizzed on?</label>
                <input
                  className="form-input"
                  placeholder="e.g. Photosynthesis, World War II, React Hooks, Calculus..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                />
              </div>

              {/* File upload */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p className="form-label mb-1">Or upload a document (optional)</p>
                <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.docx" onChange={handleFile} style={{ display: 'none' }} />
                {fileName ? (
                  <div className="flex items-center gap-1">
                    <span className="chip chip-purple">{fileName}</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setFileName(''); setFileContent(''); fileRef.current.value = ''; }}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current.click()}>
                    <Upload size={14} /> Upload File (.txt, .md)
                  </button>
                )}
              </div>
            </div>

            <div className="card mb-3">
              <h3 style={{ marginBottom: '1rem' }}>🎯 Format</h3>
              <div className="grid-2">
                {FORMATS.map(f => (
                  <button
                    key={f.id} type="button"
                    onClick={() => setFormat(f.id)}
                    className="card"
                    style={{
                      cursor: 'pointer', textAlign: 'left',
                      border: `2px solid ${format === f.id ? 'var(--primary)' : 'var(--border)'}`,
                      background: format === f.id ? 'rgba(124,58,237,0.05)' : 'var(--bg-card)',
                      transition: 'all 0.2s', padding: '1rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{f.label}</div>
                    <div className="text-secondary text-sm">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-3">
              <h3 style={{ marginBottom: '1rem' }}>⚙️ Settings</h3>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <div className="flex gap-1">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d} type="button"
                      onClick={() => setDifficulty(d)}
                      className="btn btn-sm"
                      style={{
                        background: difficulty === d ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: difficulty === d ? 'white' : 'var(--text)',
                        border: `1px solid ${difficulty === d ? 'var(--primary)' : 'var(--border)'}`,
                        flex: 1, textTransform: 'capitalize',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Number of Questions: <strong>{count}</strong></label>
                <input
                  type="range" min="3" max="20" value={count}
                  onChange={e => setCount(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <div className="flex justify-between text-sm text-secondary">
                  <span>3</span><span>20</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 20, height: 20, margin: 0, borderWidth: 2 }} /> Generating with NVIDIA NIM...</>
              ) : (
                <><Zap size={18} /> Generate Quiz</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
