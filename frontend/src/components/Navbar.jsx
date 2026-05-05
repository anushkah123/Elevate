import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ElevateLogo from './ElevateLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? '0 2px 20px rgba(139,92,246,0.1)' : 'none',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div className="container">
        <ElevateLogo />

        {/* Desktop links */}
        <ul className="navbar-links" style={{ display: 'flex' }}>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Create Quiz
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/practice"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Practice
            </NavLink>
          </li>
          <li>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/create')}
              style={{ marginLeft: '0.5rem' }}
            >
              Get started
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
