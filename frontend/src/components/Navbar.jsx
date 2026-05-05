import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain } from 'lucide-react';

export default function Navbar() {
  const { theme, toggle } = useTheme();
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
        <button className="theme-btn" onClick={toggle} title="Toggle theme">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </nav>
  );
}
