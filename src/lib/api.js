/**
 * City Search API
 * 
 * Searches the Clockzilla backend (150K+ cities).
 * Falls back to local list if backend is unreachable.
 */

import config from '@/lib/config';

export async function searchCities(query, limit = 15) {
  if (!query || query.length < 2) return [];

  // Try backend API first
  try {
    const res = await fetch(
      `${config.apiUrl}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { signal: AbortSignal.timeout?.(3000) || undefined }
    );
    if (res.ok) {
      const data = await res.json();
      return (data.results || []).map(r => ({
        id: r.id,
        city: r.city,
        state: r.state || '',
        country: r.country,
        tz: r.timezone || '',
        lat: r.lat,
        lng: r.lng,
        population: r.population || 0,
      }));
    }
  } catch (e) {
    // Backend unreachable — fall through to local
  }

  // Fallback: search local popular cities
  const q = query.toLowerCase();
  return POPULAR_CITIES.filter(c =>
    `${c.city} ${c.state} ${c.country}`.toLowerCase().includes(q)
  ).slice(0, limit);
}

export async function getPopularCities(limit = 50) {
  try {
    const res = await fetch(`${config.apiUrl}/api/cities/popular?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      return data.results || [];
    }
  } catch (e) {}
  return POPULAR_CITIES;
}

export async function getNearbyCities(lat, lng, radius = 100) {
  try {
    const res = await fetch(`${config.apiUrl}/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      return data.results || [];
    }
  } catch (e) {}
  return [];
}

// Local fallback list (used when backend is down)
const POPULAR_CITIES = [
  { city: "New York", state: "New York", country: "United States", tz: "America/New_York", lat: 40.7, lng: -74 },
  { city: "Los Angeles", state: "California", country: "United States", tz: "America/Los_Angeles", lat: 34.1, lng: -118.2 },
  { city: "Chicago", state: "Illinois", country: "United States", tz: "America/Chicago", lat: 41.9, lng: -87.6 },
  { city: "Houston", state: "Texas", country: "United States", tz: "America/Chicago", lat: 29.8, lng: -95.4 },
  { city: "San Francisco", state: "California", country: "United States", tz: "America/Los_Angeles", lat: 37.8, lng: -122.4 },
  { city: "Seattle", state: "Washington", country: "United States", tz: "America/Los_Angeles", lat: 47.6, lng: -122.3 },
  { city: "Miami", state: "Florida", country: "United States", tz: "America/New_York", lat: 25.8, lng: -80.2 },
  { city: "Denver", state: "Colorado", country: "United States", tz: "America/Denver", lat: 39.7, lng: -105.0 },
  { city: "Boston", state: "Massachusetts", country: "United States", tz: "America/New_York", lat: 42.4, lng: -71.1 },
  { city: "Dallas", state: "Texas", country: "United States", tz: "America/Chicago", lat: 32.8, lng: -96.8 },
  { city: "London", state: "England", country: "United Kingdom", tz: "Europe/London", lat: 51.5, lng: -0.1 },
  { city: "Paris", state: "", country: "France", tz: "Europe/Paris", lat: 48.9, lng: 2.3 },
  { city: "Berlin", state: "", country: "Germany", tz: "Europe/Berlin", lat: 52.5, lng: 13.4 },
  { city: "Tokyo", state: "", country: "Japan", tz: "Asia/Tokyo", lat: 35.7, lng: 139.7 },
  { city: "Seoul", state: "", country: "South Korea", tz: "Asia/Seoul", lat: 37.6, lng: 127.0 },
  { city: "Shanghai", state: "", country: "China", tz: "Asia/Shanghai", lat: 31.2, lng: 121.5 },
  { city: "Hong Kong", state: "", country: "Hong Kong", tz: "Asia/Hong_Kong", lat: 22.3, lng: 114.2 },
  { city: "Singapore", state: "", country: "Singapore", tz: "Asia/Singapore", lat: 1.3, lng: 103.8 },
  { city: "Dubai", state: "", country: "United Arab Emirates", tz: "Asia/Dubai", lat: 25.2, lng: 55.3 },
  { city: "Mumbai", state: "Maharashtra", country: "India", tz: "Asia/Kolkata", lat: 19.1, lng: 72.9 },
  { city: "Sydney", state: "New South Wales", country: "Australia", tz: "Australia/Sydney", lat: -33.9, lng: 151.2 },
  { city: "Auckland", state: "", country: "New Zealand", tz: "Pacific/Auckland", lat: -36.9, lng: 174.8 },
  { city: "Mexico City", state: "", country: "Mexico", tz: "America/Mexico_City", lat: 19.4, lng: -99.1 },
  { city: "Cairo", state: "", country: "Egypt", tz: "Africa/Cairo", lat: 30.0, lng: 31.2 },
  { city: "Moscow", state: "", country: "Russia", tz: "Europe/Moscow", lat: 55.8, lng: 37.6 },
  { city: "Istanbul", state: "", country: "Turkey", tz: "Europe/Istanbul", lat: 41.0, lng: 29.0 },
  { city: "Toronto", state: "Ontario", country: "Canada", tz: "America/Toronto", lat: 43.7, lng: -79.4 },
];
