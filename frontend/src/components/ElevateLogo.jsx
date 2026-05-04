import React from 'react';
import { Link } from 'react-router-dom';

/* ── Elevate Star Logo Mark ── */
export function LogoMark({ size = 38 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #a78bfa 0%, #6d28d9 100%)',
        borderRadius: Math.round(size * 0.29),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.38)',
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.52)}
        height={Math.round(size * 0.52)}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Four-pointed star */}
        <path
          d="M10 1.5L12.2 7.8H18.5L13.5 11.7L15.3 18L10 14.3L4.7 18L6.5 11.7L1.5 7.8H7.8L10 1.5Z"
          fill="white"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

/* ── Full Brand Logo ── */
export default function ElevateLogo({ size = 38, to = '/', className = '' }) {
  return (
    <Link
      to={to}
      className={`navbar-brand ${className}`}
      style={{ textDecoration: 'none' }}
    >
      <LogoMark size={size} />
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize: size * 0.6,
        color: '#6d28d9',
        letterSpacing: '-0.01em',
      }}>
        Elevate
      </span>
    </Link>
  );
}

/* ── Standalone SVG for favicon / meta ── */
export function ElevateSVGIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
    >
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#g)" />
      <path
        d="M50 10L59 35H84L65 51L72 76L50 62L28 76L35 51L16 35H41L50 10Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}
