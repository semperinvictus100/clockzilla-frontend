'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to console (and to Sentry/error service if configured)
    console.error('Clockzilla Error:', error);
    
    // If you add Sentry later:
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        background: '#1A1A2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>⚡</div>

          <h1 style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#E2E8F0',
            marginBottom: 12,
          }}>
            Something went wrong
          </h1>

          <p style={{
            fontSize: 16,
            color: '#94A3B8',
            lineHeight: 1.7,
            marginBottom: 32,
          }}>
            Clockzilla encountered an unexpected error.
            This has been logged and we&apos;ll look into it.
          </p>

          <button
            onClick={() => reset()}
            style={{
              background: '#4F46E5',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              marginRight: 12,
            }}
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'transparent',
              color: '#94A3B8',
              padding: '14px 36px',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 500,
              border: '1.5px solid #334155',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Go Home
          </button>

          <div style={{
            marginTop: 48,
            fontSize: 12,
            color: '#475569',
          }}>
            Error: {error?.message || 'Unknown error'}
          </div>
        </div>
      </body>
    </html>
  );
}
