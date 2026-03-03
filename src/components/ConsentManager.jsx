'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Clockzilla Consent Manager
 * 
 * Implements Google Consent Mode v2 with:
 * - GDPR consent banner for EU/UK/Switzerland visitors (opt-in)
 * - CCPA/CPRA opt-out for US visitors (opt-out)
 * - Integration with Google AdSense Privacy & Messaging (recommended)
 * 
 * HOW IT WORKS:
 * 1. On page load, consent defaults are set to "denied" for EU regions
 *    (via the script in layout.js that runs BEFORE any Google tags)
 * 2. This component shows a consent banner based on detected region
 * 3. When user accepts/declines, it calls gtag('consent', 'update', ...)
 * 4. Consent choice is saved to localStorage for return visits
 * 
 * GOOGLE PRIVACY & MESSAGING (RECOMMENDED):
 * Once you have an AdSense account, you can use Google's free built-in
 * consent tool instead of this custom banner:
 * 1. Go to AdSense → Privacy & messaging
 * 2. Create a "European regulations" message (GDPR)
 * 3. Create a "US state regulations" message (CCPA)
 * 4. Publish — Google will auto-show the right banner per region
 * 5. Set CONSENT_CONFIG.useGoogleCMP = true below to disable this banner
 */

// ═══ Configuration ═══
const CONSENT_CONFIG = {
  // Set to true when you've set up Google's Privacy & Messaging in AdSense
  // This will disable the custom banner (Google's CMP handles it instead)
  useGoogleCMP: false,

  // Your Google AdSense publisher ID (same one used in ads)
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',

  // Privacy policy URL (update to your actual page)
  privacyPolicyUrl: '#privacy',

  // Cookie/storage key for saving consent
  storageKey: 'clockzilla_consent',

  // How long consent is valid (days)
  consentExpiry: 365,
};

// EEA + UK + Switzerland country codes (require opt-in consent under GDPR)
const GDPR_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH',
];

// US states with privacy laws requiring opt-out (CCPA, VCDPA, CPA, etc.)
const CCPA_REGIONS = ['US'];

// ═══ Consent State Helpers ═══
function getStoredConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_CONFIG.storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Check expiry
    if (data.timestamp && Date.now() - data.timestamp > CONSENT_CONFIG.consentExpiry * 86400000) {
      localStorage.removeItem(CONSENT_CONFIG.storageKey);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveConsent(consentData) {
  try {
    localStorage.setItem(CONSENT_CONFIG.storageKey, JSON.stringify({
      ...consentData,
      timestamp: Date.now(),
    }));
  } catch {}
}

function updateGoogleConsent(granted) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    });
  }
}

// ═══ Region Detection ═══
async function detectRegion() {
  // Try timezone-based detection first (instant, no API call)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  // European timezones
  if (tz.startsWith('Europe/') || tz === 'Atlantic/Reykjavik') return 'gdpr';

  // US timezones
  if (tz.startsWith('America/') && (
    tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Denver') ||
    tz.includes('Los_Angeles') || tz.includes('Phoenix') || tz.includes('Anchorage') ||
    tz.includes('Honolulu') || tz.includes('Indiana') || tz.includes('Detroit') ||
    tz.includes('Boise') || tz.includes('Juneau') || tz.includes('Adak') ||
    tz.includes('Menominee') || tz.includes('Nome') || tz.includes('Sitka') ||
    tz.includes('Yakutat') || tz.includes('Kentucky')
  )) return 'ccpa';

  // For other regions, no strict consent banner needed (but show a light notice)
  return 'other';
}

// ═══ Consent Banner Component ═══
export default function ConsentManager() {
  const [region, setRegion] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState(null); // null | 'granted' | 'denied'

  useEffect(() => {
    // Skip if using Google's built-in CMP
    if (CONSENT_CONFIG.useGoogleCMP) return;

    // Check for stored consent
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored.consent);
      setRegion(stored.region);
      updateGoogleConsent(stored.consent === 'granted');
      return; // Don't show banner
    }

    // Detect region and show appropriate banner
    detectRegion().then(r => {
      setRegion(r);
      if (r === 'gdpr') {
        // EU: Must get consent BEFORE ads (opt-in required)
        setShowBanner(true);
      } else if (r === 'ccpa') {
        // US: Ads can show, but must offer opt-out
        updateGoogleConsent(true); // Default granted in US
        setShowBanner(true);
      } else {
        // Other: Grant by default, show small notice
        updateGoogleConsent(true);
        setShowBanner(true);
      }
    });
  }, []);

  const handleAcceptAll = useCallback(() => {
    setConsent('granted');
    setShowBanner(false);
    updateGoogleConsent(true);
    saveConsent({ consent: 'granted', region });
  }, [region]);

  const handleDeclineAll = useCallback(() => {
    setConsent('denied');
    setShowBanner(false);
    updateGoogleConsent(false);
    saveConsent({ consent: 'denied', region });
  }, [region]);

  const handleCCPAOptOut = useCallback(() => {
    setConsent('denied');
    setShowBanner(false);
    updateGoogleConsent(false);
    saveConsent({ consent: 'denied', region: 'ccpa' });
  }, [region]);

  // Don't render if using Google CMP, or no banner needed
  if (CONSENT_CONFIG.useGoogleCMP || !showBanner) return null;

  // ── GDPR Banner (EU/UK) — Opt-in required ──
  if (region === 'gdpr') {
    return (
      <div style={styles.overlay}>
        <div style={styles.banner}>
          <div style={styles.header}>
            <span style={styles.icon}>🍪</span>
            <h3 style={styles.title}>Cookie & Privacy Consent</h3>
          </div>

          <p style={styles.text}>
            We use cookies and similar technologies to serve personalized advertisements 
            and analyze site traffic. Our advertising partners (including Google AdSense) 
            may collect and process your data for targeted advertising. By clicking 
            "Accept All", you consent to the use of cookies for advertising and analytics.
          </p>

          {showDetails && (
            <div style={styles.details}>
              <div style={styles.detailSection}>
                <strong style={styles.detailTitle}>Essential Cookies</strong>
                <span style={styles.badge}>Always Active</span>
                <p style={styles.detailText}>
                  Required for basic site functionality (timezone detection, theme preferences). 
                  These do not collect personal data.
                </p>
              </div>
              <div style={styles.detailSection}>
                <strong style={styles.detailTitle}>Advertising Cookies</strong>
                <span style={{ ...styles.badge, background: '#f59e0b', color: '#fff' }}>Requires Consent</span>
                <p style={styles.detailText}>
                  Used by Google AdSense and advertising partners to show personalized ads 
                  based on your browsing activity. Includes: ad_storage, ad_user_data, ad_personalization.
                </p>
              </div>
              <div style={styles.detailSection}>
                <strong style={styles.detailTitle}>Analytics Cookies</strong>
                <span style={{ ...styles.badge, background: '#3b82f6', color: '#fff' }}>Requires Consent</span>
                <p style={styles.detailText}>
                  Help us understand how visitors use our site to improve the experience. 
                  Includes: analytics_storage.
                </p>
              </div>
              <p style={{ ...styles.detailText, marginTop: 12 }}>
                For more details, see our{' '}
                <a href={CONSENT_CONFIG.privacyPolicyUrl} style={styles.link}>Privacy Policy</a>
                {' '}and{' '}
                <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer" style={styles.link}>
                  Google's Privacy & Terms
                </a>.
              </p>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button onClick={() => setShowDetails(!showDetails)} style={styles.detailsBtn}>
              {showDetails ? 'Hide Details' : 'Cookie Details'}
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleDeclineAll} style={styles.declineBtn}>Decline All</button>
              <button onClick={handleAcceptAll} style={styles.acceptBtn}>Accept All</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CCPA Banner (US) — Opt-out with default granted ──
  if (region === 'ccpa') {
    return (
      <div style={styles.bottomBar}>
        <div style={styles.bottomContent}>
          <p style={styles.bottomText}>
            We use cookies and share data with advertising partners (including Google) 
            to serve personalized ads.{' '}
            <a href={CONSENT_CONFIG.privacyPolicyUrl} style={styles.link}>Privacy Policy</a>
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={handleCCPAOptOut} style={styles.optOutBtn}>
              Do Not Sell/Share My Info
            </button>
            <button onClick={handleAcceptAll} style={styles.okBtn}>OK</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Other Regions — Light notice ──
  return (
    <div style={styles.bottomBar}>
      <div style={styles.bottomContent}>
        <p style={styles.bottomText}>
          This site uses cookies for advertising and analytics.{' '}
          <a href={CONSENT_CONFIG.privacyPolicyUrl} style={styles.link}>Learn more</a>
        </p>
        <button onClick={handleAcceptAll} style={styles.okBtn}>Got it</button>
      </div>
    </div>
  );
}

// ═══ Styles ═══
const styles = {
  // GDPR: Full modal overlay
  overlay: {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, fontFamily: "'Outfit', -apple-system, sans-serif",
  },
  banner: {
    background: '#fff', borderRadius: 20, padding: '32px 28px',
    maxWidth: 560, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    color: '#1a1a2e',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
  },
  icon: { fontSize: 28 },
  title: {
    fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: 0,
  },
  text: {
    fontSize: 14, lineHeight: 1.7, color: '#555', marginBottom: 20,
  },

  // Cookie details
  details: {
    background: '#f8f9fa', borderRadius: 12, padding: 20,
    marginBottom: 20, border: '1px solid #e9ecef',
  },
  detailSection: {
    marginBottom: 16, paddingBottom: 16,
    borderBottom: '1px solid #e9ecef',
  },
  detailTitle: {
    fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginRight: 8,
  },
  badge: {
    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
    background: '#e9ecef', color: '#666', textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 13, color: '#666', lineHeight: 1.6, marginTop: 6,
  },
  link: {
    color: '#3b82f6', textDecoration: 'underline', fontWeight: 500,
  },

  // Buttons
  buttonRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 10,
  },
  acceptBtn: {
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 12,
    padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif", transition: 'background 0.2s',
  },
  declineBtn: {
    background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
    borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
  },
  detailsBtn: {
    background: 'transparent', color: '#64748b', border: 'none',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '8px 0',
    textDecoration: 'underline', fontFamily: "'Outfit', sans-serif",
  },

  // CCPA / Other: Bottom bar
  bottomBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000,
    background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
    fontFamily: "'Outfit', -apple-system, sans-serif",
  },
  bottomContent: {
    maxWidth: 1060, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, flexWrap: 'wrap',
  },
  bottomText: {
    color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0, flex: 1,
  },
  okBtn: {
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10,
    padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap',
  },
  optOutBtn: {
    background: 'transparent', color: '#94a3b8', border: '1px solid #475569',
    borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap',
  },
};
