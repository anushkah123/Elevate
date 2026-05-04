import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import { useQuiz } from '../context/QuizContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { history } = useQuiz();

  const chartData = history.map((h, i) => ({
    name: `Quiz ${i + 1}`,
    score: h.pct,
    topic: h.topic,
  })).reverse();

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + h.pct, 0) / history.length)
    : 0;

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 900 }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Track your learning progress over time</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Quizzes taken', value: history.length },
            { label: 'Average score', value: `${avgScore}%` },
            { label: 'Best score', value: history.length ? `${Math.max(...history.map(h => h.pct))}%` : '—' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '1.25rem',
              textAlign: 'center',
            }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: 'var(--lilac-600)', display: 'block' }}>{s.value}</span>
              <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {chartData.length > 0 ? (
          <div className="chart-card" style={{ marginBottom: '2rem' }}>
            <div className="chart-title">Score history</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}
                  formatter={(v) => [`${v}%`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={{ fill: '#7c3aed', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{
            background: 'var(--lilac-50)',
            border: '1px dashed var(--lilac-300)',
            borderRadius: 16,
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <div style={{ fontSize: 32, marginBottom: '1rem' }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-mid)', marginBottom: 8 }}>No quiz history yet</div>
            <div style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: '1.5rem' }}>Take a quiz to see your progress here</div>
            <button className="btn btn-primary" onClick={() => navigate('/create')}>Create your first quiz →</button>
          </div>
        )}

        {history.length > 0 && (
          <div className="chart-card">
            <div className="chart-title">Recent quizzes</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Topic', 'Score', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-dark)', fontWeight: 500 }}>{h.topic}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        background: h.pct >= 80 ? '#f0fdf4' : h.pct >= 50 ? 'var(--lilac-100)' : '#fef2f2',
                        color: h.pct >= 80 ? '#15803d' : h.pct >= 50 ? 'var(--lilac-700)' : '#b91c1c',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>{h.pct}%</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-light)', fontSize: 13 }}>
                      {new Date(h.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
