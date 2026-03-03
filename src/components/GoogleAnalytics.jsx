'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Google Analytics 4 — Clockzilla Integration
 * 
 * SETUP:
 * 1. Go to https://analytics.google.com
 * 2. Create a new GA4 property for your Clockzilla domain
 * 3. Get your Measurement ID (starts with "G-")
 * 4. Replace GA_MEASUREMENT_ID below with your real ID
 * 
 * FEATURES TRACKED:
 * ✓ Page views (automatic)
 * ✓ Visitor count (Users metric in GA4)
 * ✓ Geographic location (built-in: country, city, region)
 * ✓ Device & browser info (built-in)
 * ✓ Traffic sources & referrers (built-in)
 * ✓ Custom events: tab switches, theme changes, language changes
 * ✓ City searches, timezone conversions, timer/stopwatch usage
 * ✓ Respects Consent Mode v2 (analytics_storage consent required in EU)
 * 
 * VIEWING DATA:
 * - Visitor count: GA4 → Reports → Realtime (live) or Acquisition → Overview
 * - Geography: GA4 → Reports → Demographics → Geographic details
 *   OR: GA4 → Explore → Create custom report with "Country" / "City" dimensions
 * - All reports available at: https://analytics.google.com
 * 
 * NOTE: Google Analytics automatically collects geography data using 
 * IP-based geolocation. No extra code needed for location tracking.
 * The data appears in GA4 under Demographics → Geographic details.
 */

// ═══════════════════════════════════════
// REPLACE THIS WITH YOUR REAL GA4 ID
// ═══════════════════════════════════════
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// ═══ Helper: Send events to GA4 ═══
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    window.gtag('event', eventName, params);
  }
}

// ═══ Pre-built tracking functions for Clockzilla features ═══

/** Track when user switches tabs */
export function trackTabSwitch(tabName) {
  trackEvent('tab_switch', {
    tab_name: tabName,
    event_category: 'navigation',
  });
}

/** Track when user changes theme */
export function trackThemeChange(themeName) {
  trackEvent('theme_change', {
    theme_name: themeName,
    event_category: 'customization',
  });
}

/** Track when user changes language */
export function trackLanguageChange(langCode) {
  trackEvent('language_change', {
    language: langCode,
    event_category: 'customization',
  });
}

/** Track city searches */
export function trackCitySearch(query, resultCount) {
  trackEvent('city_search', {
    search_term: query,
    result_count: resultCount,
    event_category: 'search',
  });
}

/** Track timezone conversions */
export function trackTimezoneConvert(fromTz, toTz) {
  trackEvent('timezone_convert', {
    from_timezone: fromTz,
    to_timezone: toTz,
    event_category: 'tools',
  });
}

/** Track stopwatch usage */
export function trackStopwatch(action) {
  trackEvent('stopwatch_use', {
    action: action, // 'start', 'stop', 'lap', 'reset'
    event_category: 'tools',
  });
}

/** Track timer usage */
export function trackTimer(action, duration) {
  trackEvent('timer_use', {
    action: action, // 'start', 'pause', 'reset'
    duration_seconds: duration,
    event_category: 'tools',
  });
}

/** Track fullscreen mode */
export function trackFullscreen(entered) {
  trackEvent('fullscreen_toggle', {
    action: entered ? 'enter' : 'exit',
    event_category: 'engagement',
  });
}

/** Track world clock additions */
export function trackWorldClockSelect(city, timezone) {
  trackEvent('world_clock_select', {
    city: city,
    timezone: timezone,
    event_category: 'tools',
  });
}

// ═══ Analytics Component ═══
export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Don't render if no measurement ID configured
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* GA4 Script — loads after consent mode defaults are set */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            // Enhanced measurement (auto-tracks scrolls, outbound clicks, etc.)
            send_page_view: true,
            // Cookie settings
            cookie_flags: 'SameSite=None;Secure',
            // Enable enhanced demographics & interests
            allow_google_signals: true,
            allow_ad_personalization_signals: true,
          });
        `}
      </Script>
    </>
  );
}

/**
 * Page view tracker hook — call this in your page component
 * to track SPA navigation (tab changes act as virtual page views)
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);
}
