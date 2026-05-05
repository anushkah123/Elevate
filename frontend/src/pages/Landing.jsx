import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, BarChart3, RefreshCw, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  { icon: <Brain size={24} />, title: 'AI-Powered Generation', desc: 'NVIDIA NIM LLaMA 3 generates unique, contextual questions on any topic instantly.' },
  { icon: <Target size={24} />, title: 'Adaptive Learning', desc: 'Identifies your weak spots and generates targeted practice to close knowledge gaps.' },
  { icon: <BarChart3 size={24} />, title: 'Progress Analytics', desc: 'Radar charts, score history, and topic mastery tracking across all your quizzes.' },
  { icon: <RefreshCw size={24} />, title: 'Flashcard Mode', desc: 'Convert any quiz into interactive flashcards for efficient spaced repetition.' },
  { icon: <BookOpen size={24} />, title: 'Multiple Formats', desc: 'MCQ, True/False, and Short Answer — or mix them all in one quiz.' },
  { icon: <Zap size={24} />, title: 'Instant Results', desc: 'Real-time explanations, subtopic breakdowns, and detailed performance insights.' },
];

export default function Landing() {
  return (
    <div className="page">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(6,182,212,0.06) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div className="fade-in">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="chip chip-purple">
              <Sparkles size={12} /> Powered by NVIDIA NIM
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Quiz Generation,{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reimagined
            </span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Enter any topic and get a fully personalized quiz in seconds. Adaptive AI identifies your gaps and helps you truly master the material.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link to="/create" className="btn btn-primary btn-lg">
              <Zap size={18} /> Generate a Quiz <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-lg">
              <BarChart3 size={18} /> View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: 'var(--primary)', padding: '1rem' }}>
        <div className="container">
          <div className="flex items-center justify-center gap-3 flex-wrap" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {[['LLaMA 3.3 70B', 'AI Model'], ['3 Formats', 'MCQ • T/F • SA'], ['Adaptive AI', 'Personalized'], ['Real-time', 'Explanations']].map(([v, l]) => (
              <div key={v} className="text-center" style={{ padding: '0 1.5rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>{v}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="text-center mb-4">
          <h2 className="section-title">Everything you need to learn faster</h2>
          <p className="section-subtitle">A complete learning platform powered by state-of-the-art AI</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card card-hover fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.12))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', color: 'var(--primary)',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p className="text-secondary text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card text-center mt-4" style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          border: 'none', color: 'white', padding: '3rem',
        }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: '0.75rem' }}>Ready to master any topic?</h2>
          <p style={{ opacity: 0.85, marginBottom: '1.5rem' }}>Generate your first AI quiz in under 10 seconds.</p>
          <Link to="/create" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
            <Brain size={18} /> Start Now — It's Free
          </Link>
        </div>
      </div>
    </div>
  );
}
