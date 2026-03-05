import Script from 'next/script';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clockzilla.io';

export const metadata = {
  // ── Core ──
  title: {
    default: 'Clockzilla — Accurate World Time',
    template: '%s | Clockzilla',
  },
  description: 'Accurate world time with 150,000+ cities. Timezone converter, sunrise & sunset calculator, world clocks, stopwatch, timer, and calendar in 58 languages.',
  keywords: [
    'world clock', 'current time', 'what time is it', 'time zone converter', 'accurate time',
    'NTP clock', 'online clock', 'exact time now', 'atomic clock', 'precise time',
    'sunrise sunset', 'world time', 'stopwatch', 'timer', 'pomodoro timer',
    'timezone converter', 'time difference calculator', 'current time in new york',
    'current time in london', 'current time in tokyo', 'GMT time', 'UTC time',
    'time zone map', 'daylight saving time', 'countdown timer', 'world clock app',
    'free online clock', 'time in different countries',
  ],
  authors: [{ name: 'Clockzilla' }],
  creator: 'Clockzilla',
  publisher: 'Clockzilla',
  generator: 'Next.js',

  // ── Canonical URL ──
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },

  // ── Favicons & Icons ──
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },

  // ── Web Manifest ──
  manifest: '/manifest.json',

  // ── Open Graph (Facebook, LinkedIn, etc.) ──
  openGraph: {
    title: 'Clockzilla — Accurate World Time for 150K+ Cities',
    description: 'Free world clock with NTP-synced time for 150,000+ cities. Timezone converter, sunrise & sunset, world clocks, stopwatch, timer, and more in 58 languages.',
    url: SITE_URL,
    siteName: 'Clockzilla',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clockzilla — Accurate World Time',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // ── Twitter Card ──
  twitter: {
    card: 'summary_large_image',
    title: 'Clockzilla — Accurate World Time for 150K+ Cities',
    description: 'Free NTP-synced world clock for 150,000+ cities. Timezone converter, sunrise & sunset, and more in 58 languages.',
    images: ['/og-image.png'],
    creator: '@clockzilla',
  },

  // ── Mobile & PWA ──
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A2E' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Clockzilla',
  },
  formatDetection: {
    telephone: false,
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification (add your IDs after setup) ──
  other: {
    'google-adsense-account': 'ca-pub-7108121674893713',
  },
  // verification: {
  //   google: 'your-google-site-verification-id',
  //   yandex: 'your-yandex-verification-id',
  //   bing: 'your-bing-verification-id',
  // },

  // ── Other ──
  category: 'utilities',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
         * ═══════════════════════════════════════════════════════
         * GOOGLE CONSENT MODE V2 — MUST LOAD BEFORE ALL TAGS
         * ═══════════════════════════════════════════════════════
         * This sets consent defaults to "denied" for EU/UK/CH regions
         * and "granted" for all other regions. The ConsentManager
         * component will update these states when the user responds.
         *
         * IMPORTANT: This MUST execute before AdSense or Analytics loads.
         */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Default: DENIED for EU/UK/Switzerland (GDPR opt-in required)
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'granted',
              'security_storage': 'granted',
              'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
                         'DE','GR','HU','IS','IE','IT','LV','LI','LT','LU',
                         'MT','NL','NO','PL','PT','RO','SK','SI','ES','SE',
                         'GB','CH'],
              'wait_for_update': 500
            });

            // Default: GRANTED for all other regions (US CCPA = opt-out model)
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'functionality_storage': 'granted',
              'security_storage': 'granted'
            });

            // Redact ads data when consent is denied
            gtag('set', 'ads_data_redaction', true);

            // Enable URL passthrough for better conversion tracking
            gtag('set', 'url_passthrough', true);
          `}
        </Script>

        {/*
         * ═══════════════════════════════════════════════════════
         * GOOGLE ADSENSE
         * ═══════════════════════════════════════════════════════
         * Replace ca-pub-7108121674893713 with your real publisher ID
         * AdSense is active with publisher ID ca-pub-7108121674893713
         */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7108121674893713"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/*
         * ═══════════════════════════════════════════════════════
         * GOOGLE PRIVACY & MESSAGING (OPTIONAL — RECOMMENDED)
         * ═══════════════════════════════════════════════════════
         * Once you set up Privacy & Messaging in your AdSense dashboard,
         * Google will auto-inject its own consent banner. You can then
         * set CONSENT_CONFIG.useGoogleCMP = true in ConsentManager.jsx
         * to disable the custom consent banner.
         *
         * Setup: AdSense → Privacy & messaging → Create messages for:
         *   1. "European regulations" (GDPR)
         *   2. "US state regulations" (CCPA/CPRA)  
         *   3. "IDFA" (if you ever make a mobile app)
         *
         * Google's CMP is free, auto-certified, and handles everything.
         */}
        {/*
        <Script
          id="google-funding-choices"
          src="https://fundingchoicesmessages.google.com/i/ca-pub-7108121674893713?ers=1"
          strategy="afterInteractive"
        />
        <Script id="google-fc-init" strategy="afterInteractive">
          {`(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}} } signalGooglefcPresent();})();`}
        </Script>
        */}
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics 4 — Respects Consent Mode v2 */}
        <GoogleAnalytics />

        {/* JSON-LD Structured Data for Rich Search Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Clockzilla',
              url: SITE_URL,
              description: 'Accurate world time with 150,000+ cities. Timezone converter, sunrise & sunset calculator, world clocks, stopwatch, timer.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Accurate NTP time synchronization',
                'World clocks for 150,000+ cities',
                'Timezone converter',
                'Sunrise and sunset calculator',
                'Stopwatch with lap tracking',
                'Countdown timer with alarm',
                'Pomodoro timer',
                'Calendar with holidays and moon phases',
                'Age and birthday calculator',
                'DST information',
                '58 language translations',
                '6 visual themes',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '150',
                bestRating: '5',
              },
            }),
          }}
        />


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is the most accurate online clock?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Clockzilla synchronizes with NTP time servers (TimeAPI.io and Cloudflare) to provide millisecond-accurate time. It measures network latency and statistically filters results for the most precise offset calculation.' },
                },
                {
                  '@type': 'Question',
                  name: 'How do I check the current time in another city?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Use Clockzilla\\'s search bar to type any city name from our database of 150,000+ cities worldwide. The app instantly shows the accurate local time, timezone, sunrise, sunset, and DST information for that city.' },
                },
                {
                  '@type': 'Question',
                  name: 'What is a timezone converter?',
                  acceptedAnswer: { '@type': 'Answer', text: 'A timezone converter lets you compare the current time across different time zones simultaneously. Clockzilla\\'s converter supports all IANA timezones and shows the offset between any two cities, making it easy to schedule meetings across time zones.' },
                },
                {
                  '@type': 'Question',
                  name: 'Is Clockzilla free to use?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, Clockzilla is completely free. It offers accurate time for 150,000+ cities, timezone conversion, sunrise/sunset times, a stopwatch, timer, Pomodoro timer, calendar, and more — all available in 58 languages with no account required.' },
                },
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
