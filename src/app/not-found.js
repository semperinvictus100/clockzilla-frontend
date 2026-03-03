'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: 24,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Clock icon */}
        <div style={{ fontSize: 72, marginBottom: 16 }}>🕐</div>

        {/* 404 */}
        <div style={{
          fontSize: 120,
          fontWeight: 200,
          color: '#4F46E5',
          lineHeight: 1,
          marginBottom: 8,
          fontVariantNumeric: 'tabular-nums',
        }}>
          404
        </div>

        {/* Message */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#E2E8F0',
          marginBottom: 12,
        }}>
          Lost in Time
        </h1>
        <p style={{
          fontSize: 16,
          color: '#94A3B8',
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the right timezone.
        </p>

        {/* Back to home */}
        <Link href="/" style={{
          display: 'inline-block',
          background: '#4F46E5',
          color: '#fff',
          padding: '14px 36px',
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: "'Outfit', sans-serif",
          transition: 'background 0.2s',
        }}>
          Back to Clockzilla
        </Link>

        {/* Footer */}
        <div style={{
          marginTop: 48,
          fontSize: 13,
          color: '#475569',
        }}>
          Clockzilla — Accurate World Time
        </div>
      </div>
    </div>
  );
}
