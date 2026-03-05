/**
 * Dynamic sitemap.xml generator
 * Generates URLs for the homepage + all 60+ city time pages
 * Next.js serves this at /sitemap.xml automatically.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clockzilla.io';

const CITIES = [
  'new-york', 'los-angeles', 'chicago', 'houston', 'phoenix', 'denver',
  'miami', 'san-francisco', 'seattle', 'washington-dc',
  'london', 'paris', 'berlin', 'rome', 'madrid', 'amsterdam', 'vienna',
  'moscow', 'istanbul', 'lisbon', 'dublin', 'zurich', 'stockholm',
  'oslo', 'copenhagen', 'athens', 'warsaw', 'prague', 'budapest',
  'dubai', 'mumbai', 'delhi', 'bangalore', 'bangkok', 'singapore',
  'hong-kong', 'beijing', 'shanghai', 'tokyo', 'seoul',
  'sydney', 'melbourne', 'auckland',
  'toronto', 'vancouver', 'mexico-city',
  'sao-paulo', 'buenos-aires', 'bogota', 'lima', 'santiago',
  'cairo', 'lagos', 'nairobi', 'johannesburg',
  'jakarta', 'manila', 'kuala-lumpur', 'riyadh', 'doha', 'taipei',
  'honolulu', 'anchorage',
];

export default function sitemap() {
  const now = new Date().toISOString();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...CITIES.map(city => ({
      url: `${BASE_URL}/time/${city}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })),
  ];
}
