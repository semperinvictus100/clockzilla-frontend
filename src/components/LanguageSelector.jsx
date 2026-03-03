'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n, LANGUAGES } from '@/lib/i18n';

/**
 * LanguageSelector — Footer language picker
 * 
 * Shows a globe icon + current language name.
 * Clicking opens a full grid of 58 languages.
 */
export default function LanguageSelector({ theme: t }) {
  const { lang, setLang, strings } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const currentLang = LANGUAGES.find(l => l.code === lang);
  const filtered = search
    ? LANGUAGES.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.english.toLowerCase().includes(search.toLowerCase()) ||
        l.code.toLowerCase().includes(search.toLowerCase())
      )
    : LANGUAGES;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(!open); setSearch(''); }}
        style={{
          background: 'transparent',
          border: `1.5px solid ${t.border}`,
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          color: t.textSoft,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "'Outfit', sans-serif",
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.borderColor = t.accent; e.target.style.color = t.accent; }}
        onMouseLeave={e => { e.target.style.borderColor = t.border; e.target.style.color = t.textSoft; }}
      >
        <span style={{ fontSize: 18 }}>🌐</span>
        <span>{currentLang?.name || 'English (US)'}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Language picker overlay */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: t.card,
            borderRadius: 24,
            border: `1.5px solid ${t.border}`,
            boxShadow: `0 20px 60px ${t.shadow}`,
            width: '100%',
            maxWidth: 720,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px 16px',
              borderBottom: `1px solid ${t.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0 }}>
                  🌐 {strings.footer?.language || 'Language'}
                </h3>
                <p style={{ fontSize: 13, color: t.textMuted, margin: '4px 0 0' }}>
                  {LANGUAGES.length} languages available
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: t.bgSub,
                  border: `1px solid ${t.border}`,
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: t.textMuted,
                }}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '12px 28px' }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search languages..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${t.border}`,
                  background: t.bgSub,
                  color: t.text,
                  fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                  outline: 'none',
                }}
              />
            </div>

            {/* Language grid */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 28px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 6,
              alignContent: 'start',
            }}>
              {filtered.map(l => {
                const isActive = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    style={{
                      background: isActive ? t.accent : 'transparent',
                      color: isActive ? '#fff' : t.textSoft,
                      border: `1.5px solid ${isActive ? t.accent : t.borderLight}`,
                      borderRadius: 10,
                      padding: '10px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = t.accent;
                        e.currentTarget.style.background = `${t.accent}15`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = t.borderLight;
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}>{l.name}</span>
                    <span style={{ fontSize: 11, opacity: 0.6 }}>{l.english}</span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: t.textMuted, fontSize: 14 }}>
                  No languages found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
