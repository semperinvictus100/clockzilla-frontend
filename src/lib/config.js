/**
 * Clockzilla App Configuration
 * 
 * Centralized config for API URLs, feature flags, etc.
 * Uses NEXT_PUBLIC_ env vars for client-side access.
 */

const config = {
  // Backend API base URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Site metadata
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Clockzilla',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  siteDescription: 'Accurate world time with 150,000+ cities. Timezone converter, sunrise & sunset, world clocks, and more.',

  // Time sync configuration
  timeSync: {
    // NTP-style sync interval (ms)
    syncInterval: 4 * 60 * 1000, // 4 minutes
    // Number of sample rounds per sync
    sampleRounds: 3,
    // Timeout per API request (ms)
    requestTimeout: 5000,
  },

  // Search configuration
  search: {
    debounceMs: 300,
    maxResults: 15,
  },
};

export default config;
