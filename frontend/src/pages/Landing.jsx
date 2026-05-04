import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '✦',
    title: 'AI Quiz Generation',
    desc: 'Enter any topic and get a custom quiz in seconds — MCQ, true/false, or short answer.',
  },
  {
    icon: '◈',
    title: 'Adaptive Practice',
    desc: 'The AI detects your weak areas and auto-generates targeted follow-up questions.',
  },
  {
    icon: '⬡',
    title: 'Progress Dashboard',
    desc: 'Track improvement with beautiful score charts and per-topic radar graphs.',
  },
  {
    icon: '◎',
    title: 'Flashcard Mode',
    desc: 'Convert any quiz into interactive flashcards for spaced repetition learning.',
  },
  {
    icon: '▲',
    title: 'Detailed Explanations',
    desc: 'Every answer includes a clear explanation so you understand the why, not just the what.',
  },
  {
    icon: '◐',
    title: 'Upload Your Notes',
    desc: 'Generate quizzes directly from your PDFs and documents for exam-focused practice.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI-Powered Learning
            </div>
            <h1>
              Learn smarter,<br />
              <em>elevate</em> your results
            </h1>
            <p className="hero-sub">
              Generate intelligent quizzes on any topic. Track your progress,
              target weak spots, and master any subject with adaptive AI.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/create')}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Create a quiz — it's free
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/dashboard')}
              >
                View dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Quizzes generated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">94%</span>
            <span className="stat-label">Avg improvement</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">120+</span>
            <span className="stat-label">Topics covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">User rating</span>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <span className="section-tag">Why Elevate</span>
          <h2>
            Everything you need to<br />
            master any subject
          </h2>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="card" key={f.title}>
                <div className="card-icon">{f.icon}</div>
                <div className="card-title">{f.title}</div>
                <div className="card-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--lilac-600) 0%, var(--lilac-700) 100%)',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>
            Ready to elevate your learning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', marginBottom: '2.5rem' }}>
            Start for free — no credit card required.
          </p>
          <button
            className="btn btn-lg"
            onClick={() => navigate('/create')}
            style={{
              background: 'white',
              color: 'var(--lilac-700)',
              fontWeight: 600,
            }}
          >
            Generate your first quiz →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'rgba(167,139,250,0.25)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 1.5L12.2 7.8H18.5L13.5 11.7L15.3 18L10 14.3L4.7 18L6.5 11.7L1.5 7.8H7.8L10 1.5Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'white', fontWeight: 700 }}>
              Elevate
            </span>
          </div>
          <p className="footer-tagline">Elevate your learning. Every day.</p>
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Dashboard</a>
              <a href="#">Practice Mode</a>
              <a href="#">Flashcards</a>
            </div>
            <div className="footer-link-group">
              <h4>Learn</h4>
              <a href="#">Blog</a>
              <a href="#">Study guides</a>
              <a href="#">Topics</a>
            </div>
            <div className="footer-link-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Elevate. All rights reserved.</span>
            <span>Made with ♡ for curious minds</span>
          </div>
        </div>
      </footer>
    </>
  );
}
