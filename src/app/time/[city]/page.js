import { notFound } from 'next/navigation';
import ClockzillaApp from '@/components/ClockzillaApp';

/**
 * SEO-optimized city time pages
 * 
 * These pages exist so Google can index URLs like:
 *   /time/new-york → "Current Time in New York"
 *   /time/london   → "Current Time in London"
 *   /time/tokyo    → "Current Time in Tokyo"
 * 
 * Each page gets unique title, description, and structured data
 * that targets high-volume search queries.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://clockzilla.io';

// Major cities with SEO-relevant metadata
const CITY_DATA = {
  'new-york': { name: 'New York', country: 'United States', tz: 'America/New_York', region: 'Eastern Time', abbr: 'ET', utc: 'UTC-5/UTC-4' },
  'los-angeles': { name: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', region: 'Pacific Time', abbr: 'PT', utc: 'UTC-8/UTC-7' },
  'chicago': { name: 'Chicago', country: 'United States', tz: 'America/Chicago', region: 'Central Time', abbr: 'CT', utc: 'UTC-6/UTC-5' },
  'houston': { name: 'Houston', country: 'United States', tz: 'America/Chicago', region: 'Central Time', abbr: 'CT', utc: 'UTC-6/UTC-5' },
  'phoenix': { name: 'Phoenix', country: 'United States', tz: 'America/Phoenix', region: 'Mountain Time', abbr: 'MST', utc: 'UTC-7' },
  'denver': { name: 'Denver', country: 'United States', tz: 'America/Denver', region: 'Mountain Time', abbr: 'MT', utc: 'UTC-7/UTC-6' },
  'miami': { name: 'Miami', country: 'United States', tz: 'America/New_York', region: 'Eastern Time', abbr: 'ET', utc: 'UTC-5/UTC-4' },
  'san-francisco': { name: 'San Francisco', country: 'United States', tz: 'America/Los_Angeles', region: 'Pacific Time', abbr: 'PT', utc: 'UTC-8/UTC-7' },
  'seattle': { name: 'Seattle', country: 'United States', tz: 'America/Los_Angeles', region: 'Pacific Time', abbr: 'PT', utc: 'UTC-8/UTC-7' },
  'washington-dc': { name: 'Washington D.C.', country: 'United States', tz: 'America/New_York', region: 'Eastern Time', abbr: 'ET', utc: 'UTC-5/UTC-4' },
  'london': { name: 'London', country: 'United Kingdom', tz: 'Europe/London', region: 'Greenwich Mean Time', abbr: 'GMT/BST', utc: 'UTC+0/UTC+1' },
  'paris': { name: 'Paris', country: 'France', tz: 'Europe/Paris', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'berlin': { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'rome': { name: 'Rome', country: 'Italy', tz: 'Europe/Rome', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'madrid': { name: 'Madrid', country: 'Spain', tz: 'Europe/Madrid', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'amsterdam': { name: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'vienna': { name: 'Vienna', country: 'Austria', tz: 'Europe/Vienna', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'moscow': { name: 'Moscow', country: 'Russia', tz: 'Europe/Moscow', region: 'Moscow Time', abbr: 'MSK', utc: 'UTC+3' },
  'istanbul': { name: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul', region: 'Turkey Time', abbr: 'TRT', utc: 'UTC+3' },
  'dubai': { name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', region: 'Gulf Standard Time', abbr: 'GST', utc: 'UTC+4' },
  'mumbai': { name: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', region: 'India Standard Time', abbr: 'IST', utc: 'UTC+5:30' },
  'delhi': { name: 'Delhi', country: 'India', tz: 'Asia/Kolkata', region: 'India Standard Time', abbr: 'IST', utc: 'UTC+5:30' },
  'bangalore': { name: 'Bangalore', country: 'India', tz: 'Asia/Kolkata', region: 'India Standard Time', abbr: 'IST', utc: 'UTC+5:30' },
  'bangkok': { name: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok', region: 'Indochina Time', abbr: 'ICT', utc: 'UTC+7' },
  'singapore': { name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', region: 'Singapore Time', abbr: 'SGT', utc: 'UTC+8' },
  'hong-kong': { name: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong', region: 'Hong Kong Time', abbr: 'HKT', utc: 'UTC+8' },
  'beijing': { name: 'Beijing', country: 'China', tz: 'Asia/Shanghai', region: 'China Standard Time', abbr: 'CST', utc: 'UTC+8' },
  'shanghai': { name: 'Shanghai', country: 'China', tz: 'Asia/Shanghai', region: 'China Standard Time', abbr: 'CST', utc: 'UTC+8' },
  'tokyo': { name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', region: 'Japan Standard Time', abbr: 'JST', utc: 'UTC+9' },
  'seoul': { name: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', region: 'Korea Standard Time', abbr: 'KST', utc: 'UTC+9' },
  'sydney': { name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', region: 'Australian Eastern Time', abbr: 'AEST', utc: 'UTC+10/UTC+11' },
  'melbourne': { name: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne', region: 'Australian Eastern Time', abbr: 'AEST', utc: 'UTC+10/UTC+11' },
  'auckland': { name: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland', region: 'New Zealand Time', abbr: 'NZST', utc: 'UTC+12/UTC+13' },
  'toronto': { name: 'Toronto', country: 'Canada', tz: 'America/Toronto', region: 'Eastern Time', abbr: 'ET', utc: 'UTC-5/UTC-4' },
  'vancouver': { name: 'Vancouver', country: 'Canada', tz: 'America/Vancouver', region: 'Pacific Time', abbr: 'PT', utc: 'UTC-8/UTC-7' },
  'mexico-city': { name: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City', region: 'Central Time', abbr: 'CST', utc: 'UTC-6' },
  'sao-paulo': { name: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo', region: 'Brasília Time', abbr: 'BRT', utc: 'UTC-3' },
  'buenos-aires': { name: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires', region: 'Argentina Time', abbr: 'ART', utc: 'UTC-3' },
  'bogota': { name: 'Bogotá', country: 'Colombia', tz: 'America/Bogota', region: 'Colombia Time', abbr: 'COT', utc: 'UTC-5' },
  'lima': { name: 'Lima', country: 'Peru', tz: 'America/Lima', region: 'Peru Time', abbr: 'PET', utc: 'UTC-5' },
  'santiago': { name: 'Santiago', country: 'Chile', tz: 'America/Santiago', region: 'Chile Time', abbr: 'CLT', utc: 'UTC-4/UTC-3' },
  'cairo': { name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo', region: 'Eastern European Time', abbr: 'EET', utc: 'UTC+2' },
  'lagos': { name: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos', region: 'West Africa Time', abbr: 'WAT', utc: 'UTC+1' },
  'nairobi': { name: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi', region: 'East Africa Time', abbr: 'EAT', utc: 'UTC+3' },
  'johannesburg': { name: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg', region: 'South Africa Time', abbr: 'SAST', utc: 'UTC+2' },
  'jakarta': { name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta', region: 'Western Indonesia Time', abbr: 'WIB', utc: 'UTC+7' },
  'manila': { name: 'Manila', country: 'Philippines', tz: 'Asia/Manila', region: 'Philippine Time', abbr: 'PHT', utc: 'UTC+8' },
  'kuala-lumpur': { name: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', region: 'Malaysia Time', abbr: 'MYT', utc: 'UTC+8' },
  'riyadh': { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', region: 'Arabia Standard Time', abbr: 'AST', utc: 'UTC+3' },
  'doha': { name: 'Doha', country: 'Qatar', tz: 'Asia/Qatar', region: 'Arabia Standard Time', abbr: 'AST', utc: 'UTC+3' },
  'taipei': { name: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei', region: 'Taipei Standard Time', abbr: 'CST', utc: 'UTC+8' },
  'lisbon': { name: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon', region: 'Western European Time', abbr: 'WET', utc: 'UTC+0/UTC+1' },
  'dublin': { name: 'Dublin', country: 'Ireland', tz: 'Europe/Dublin', region: 'Irish Standard Time', abbr: 'IST', utc: 'UTC+0/UTC+1' },
  'zurich': { name: 'Zurich', country: 'Switzerland', tz: 'Europe/Zurich', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'stockholm': { name: 'Stockholm', country: 'Sweden', tz: 'Europe/Stockholm', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'oslo': { name: 'Oslo', country: 'Norway', tz: 'Europe/Oslo', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'copenhagen': { name: 'Copenhagen', country: 'Denmark', tz: 'Europe/Copenhagen', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'athens': { name: 'Athens', country: 'Greece', tz: 'Europe/Athens', region: 'Eastern European Time', abbr: 'EET', utc: 'UTC+2/UTC+3' },
  'warsaw': { name: 'Warsaw', country: 'Poland', tz: 'Europe/Warsaw', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'prague': { name: 'Prague', country: 'Czech Republic', tz: 'Europe/Prague', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'budapest': { name: 'Budapest', country: 'Hungary', tz: 'Europe/Budapest', region: 'Central European Time', abbr: 'CET', utc: 'UTC+1/UTC+2' },
  'honolulu': { name: 'Honolulu', country: 'United States', tz: 'Pacific/Honolulu', region: 'Hawaii Time', abbr: 'HST', utc: 'UTC-10' },
  'anchorage': { name: 'Anchorage', country: 'United States', tz: 'America/Anchorage', region: 'Alaska Time', abbr: 'AKST', utc: 'UTC-9/UTC-8' },
};

// Export for sitemap
export { CITY_DATA };

// Generate all city pages at build time
export function generateStaticParams() {
  return Object.keys(CITY_DATA).map(city => ({ city }));
}

// Generate unique metadata for each city
export async function generateMetadata({ params }) {
  const { city } = await params;
  const data = CITY_DATA[city];
  if (!data) return {};

  const title = `Current Time in ${data.name}, ${data.country} — Clockzilla`;
  const description = `What time is it in ${data.name}? Live ${data.region} (${data.abbr}, ${data.utc}) clock with NTP accuracy. Sunrise, sunset, timezone info, and more.`;

  return {
    title,
    description,
    keywords: [
      `current time ${data.name}`, `time in ${data.name}`, `${data.name} time zone`,
      `what time is it in ${data.name}`, `${data.name} clock`, `${data.region}`,
      `${data.abbr} time`, `${data.name} sunrise sunset`,
    ],
    alternates: { canonical: `/time/${city}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/time/${city}`,
      siteName: 'Clockzilla',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// The page component
export default async function CityTimePage({ params }) {
  const { city } = await params;
  const data = CITY_DATA[city];
  if (!data) notFound();

  return (
    <>
      {/* Server-rendered SEO content (visible to crawlers) */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="false">
        <h1>Current Time in {data.name}, {data.country}</h1>
        <p>The current local time in {data.name}, {data.country} is displayed below using NTP-synchronized clocks accurate to within milliseconds.</p>
        <p>{data.name} is in the {data.region} timezone ({data.abbr}, {data.utc}).</p>
        <p>Clockzilla provides accurate time, sunrise and sunset times, timezone conversion, and world clock features for {data.name} and over 150,000 other cities worldwide.</p>
        <h2>Timezone Information for {data.name}</h2>
        <ul>
          <li>Timezone: {data.region} ({data.abbr})</li>
          <li>UTC Offset: {data.utc}</li>
          <li>Country: {data.country}</li>
          <li>IANA Timezone: {data.tz}</li>
        </ul>
      </div>

      {/* JSON-LD for this city */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Current Time in ${data.name}`,
            description: `Live clock for ${data.name}, ${data.country}. ${data.region} (${data.abbr}).`,
            url: `${SITE_URL}/time/${city}`,
            isPartOf: { '@type': 'WebSite', name: 'Clockzilla', url: SITE_URL },
            about: {
              '@type': 'City',
              name: data.name,
              containedInPlace: { '@type': 'Country', name: data.country },
            },
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `What time is it in ${data.name} right now?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${data.name} is in the ${data.region} timezone (${data.abbr}, ${data.utc}). Use Clockzilla for the exact current time, synced via NTP for millisecond accuracy.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `What timezone is ${data.name} in?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${data.name}, ${data.country} is in the ${data.region} timezone, abbreviated as ${data.abbr}. The UTC offset is ${data.utc}. The IANA timezone identifier is ${data.tz}.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `What time is sunrise and sunset in ${data.name}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Sunrise and sunset times in ${data.name} change daily. Use Clockzilla to see today's exact sunrise, sunset, and daylight duration for ${data.name}.`,
                  },
                },
              ],
            },
          }),
        }}
      />

      {/* Render the main app (client-side, hydrates with city context) */}
      <ClockzillaApp initialCity={city} />
    </>
  );
}
