import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, CartesianGrid } from 'recharts';
import { BarChart3, Trophy, Target, Calendar, Brain } from 'lucide-react';

export default function Dashboard() {
  const { history } = useQuiz();

  if (!history.length) {
    return (
      <div className="page">
        <div className="container-sm text-center" style={{ paddingTop: '4rem' }}>
          <BarChart3 size={48} style={{ color: 'var(--primary-light)', marginBottom: '1rem' }} />
          <h2 className="section-title mb-2">No quiz history yet</h2>
          <p className="text-secondary mb-3">Complete your first quiz to see analytics here.</p>
          <Link to="/create" className="btn btn-primary"><Brain size={16} /> Create Your First Quiz</Link>
        </div>
      </div>
    );
  }

  const avgScore = Math.round(history.reduce((a, r) => a + r.score, 0) / history.length);
  const best = Math.max(...history.map(r => r.score));
  const totalQuestions = history.reduce((a, r) => a + r.total, 0);

  // Line chart data
  const lineData = [...history].reverse().map((r, i) => ({
    name: `Q${i + 1}`,
    score: r.score,
    topic: r.topic,
  }));

  // Radar: collect all subtopics
  const subtopicAgg = {};
  history.forEach(r => {
    Object.entries(r.subtopics || {}).forEach(([k, v]) => {
      if (!subtopicAgg[k]) subtopicAgg[k] = { correct: 0, total: 0 };
      subtopicAgg[k].correct += v.correct;
      subtopicAgg[k].total += v.total;
    });
  });
  const radarData = Object.entries(subtopicAgg).slice(0, 8).map(([k, v]) => ({
    subject: k.length > 12 ? k.slice(0, 12) + '…' : k,
    score: Math.round((v.correct / v.total) * 100),
  }));

  return (
    <div className="page">
      <div className="container">
        <div className="fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="section-title" style={{ fontSize: '2rem' }}>
                <BarChart3 size={26} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)', verticalAlign: 'middle' }} />
                Your Dashboard
              </h1>
              <p className="section-subtitle">{history.length} quiz{history.length > 1 ? 'zes' : ''} completed</p>
            </div>
            <Link to="/create" className="btn btn-primary btn-sm"><Brain size={14} /> New Quiz</Link>
          </div>

          {/* Stat cards */}
          <div className="grid-4 mb-3">
            {[
              { icon: <Trophy size={20} />, label: 'Avg Score', value: `${avgScore}%`, color: 'var(--primary)' },
              { icon: <Target size={20} />, label: 'Best Score', value: `${best}%`, color: 'var(--success)' },
              { icon: <Calendar size={20} />, label: 'Quizzes Taken', value: history.length, color: 'var(--accent)' },
              { icon: <Brain size={20} />, label: 'Questions Done', value: totalQuestions, color: 'var(--warning)' },
            ].map((s, i) => (
              <div key={i} className="card text-center">
                <div style={{ color: s.color, marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Syne', color: s.color }}>{s.value}</div>
                <div className="text-secondary text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid-2 mb-3">
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>📈 Score History</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--text)' }}
                    formatter={(v, _, { payload }) => [`${v}% — ${payload.topic}`, 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>🎯 Topic Mastery</h3>
              {radarData.length >= 3 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-secondary" style={{ padding: '3rem 0' }}>
                  Complete more quizzes to see the mastery radar chart.
                </div>
              )}
            </div>
          </div>

          {/* History table */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📋 Quiz History</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Topic', 'Score', 'Correct', 'Difficulty', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{r.topic}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontWeight: 700,
                          color: r.score >= 70 ? 'var(--success)' : r.score >= 50 ? 'var(--warning)' : 'var(--danger)',
                        }}>{r.score}%</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{r.correct}/{r.total}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`chip chip-${r.difficulty === 'easy' ? 'green' : r.difficulty === 'medium' ? 'blue' : 'red'}`} style={{ textTransform: 'capitalize' }}>
                          {r.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
