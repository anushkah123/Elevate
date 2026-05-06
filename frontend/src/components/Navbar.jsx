import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Brain, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/create', label: 'Create Quiz' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Brain size={20} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
        Elevate
      </Link>
      <div className="navbar-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link${pathname === l.to ? ' active' : ''}`}>
            {l.label}
          </Link>
        ))}
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="nav-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} /> {user.name}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={logout} title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}

        <button className="theme-btn" onClick={toggle} title="Toggle theme">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </nav>
  );
}
