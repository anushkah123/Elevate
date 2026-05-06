import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 400, padding: '2.5rem' }}>
        <div className="text-center mb-4">
          <div style={{ 
            width: 50, height: 50, borderRadius: '50%', background: 'var(--primary-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' 
          }}>
            <UserPlus size={24} />
          </div>
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Get Started</h2>
          <p className="text-secondary text-sm">Create your free Elevate account</p>
        </div>

        {error && (
          <div className="alert alert-error flex items-center gap-1 mb-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" className="form-input" style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" className="form-input" style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" className="form-input" style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-secondary">
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
