/**
 * Dynamic sitemap.xml generator
 * Next.js will serve this at /sitemap.xml automatically.
 * 
 * UPDATE: Replace 'https://clockzilla.io' with your actual domain.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clockzilla.io';

export default function sitemap() {
  const now = new Date().toISOString();

  // Main pages / app features (all client-side routes within the SPA)
  const routes = [
    { path: '/',             changeFrequency: 'daily',   priority: 1.0 },
  ];

  // Major world cities for SEO (timezone pages — future expansion)
  const majorCities = [
    'new-york', 'london', 'tokyo', 'paris', 'sydney', 'dubai',
    'singapore', 'hong-kong', 'los-angeles', 'chicago', 'toronto',
    'berlin', 'moscow', 'mumbai', 'beijing', 'seoul', 'sao-paulo',
    'mexico-city', 'cairo', 'istanbul', 'bangkok', 'jakarta',
    'lagos', 'nairobi', 'johannesburg', 'buenos-aires', 'lima',
    'santiago', 'bogota', 'amsterdam', 'rome', 'madrid', 'vienna',
  ];

  return [
    // Core pages
    ...routes.map(route => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    // City-specific pages (for future /time/city-name routes)
    // Uncomment when you add city-specific pages:
    // ...majorCities.map(city => ({
    //   url: `${BASE_URL}/time/${city}`,
    //   lastModified: now,
    //   changeFrequency: 'daily',
    //   priority: 0.7,
    // })),
  ];
}
