# ⏰ Clockzilla Frontend (Next.js)

A production-ready world time application built with Next.js and React.

## Features

- 🕐 **Accurate time** synced via NTP (WorldTimeAPI + your backend)
- 🔍 **Search 150K+ cities** with instant autocomplete
- 🌍 **World clocks** for major cities
- 🌅 **Sunrise & sunset** (NOAA solar calculator)
- 🗺️ **Live day/night map**
- ⏱️ **Stopwatch & timer**
- 📅 **Calendar with week numbers**
- 🔄 **Timezone converter**
- ⏳ **Countdown to any date**
- 🎨 **6 themes** (Midnight, Arctic, Earth, Sunset, Ocean, Lavender)
- 📍 **Auto location detection**
- 📱 **Fully responsive**

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
cp .env.local.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:3001

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Clockzilla backend URL | `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_NAME` | Site name for SEO | `Clockzilla` |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO | `http://localhost:3000` |

## Architecture

```
src/
├── app/
│   ├── layout.js          # Root layout + SEO metadata
│   ├── page.js            # Home page
│   └── globals.css        # Global styles + animations
├── components/
│   └── ClockzillaApp.jsx     # Main app component (client-side)
├── hooks/
│   └── useTimeSync.js     # NTP-style time sync (3-tier)
└── lib/
    ├── api.js             # City search API client
    └── config.js          # Centralized configuration
```

## Time Sync Architecture

The app synchronizes time using a 3-tier NTP-style system:

1. **Tier 1: Your backend** — Reads the `Date` header from `/api/health` (lowest latency)
2. **Tier 2: WorldTimeAPI** — Public NTP-synced API returning unix timestamps
3. **Tier 3: TimeAPI.io** — Secondary public time API

Each source is sampled 3 times. Statistical filtering (MAD-based outlier rejection) and RTT-weighted averaging produce a final offset accurate to ±50-500ms.

## Deployment

Works with any Next.js hosting:

| Platform | Notes |
|---|---|
| **Vercel** | Zero-config, just connect repo |
| **Netlify** | Use `@netlify/plugin-nextjs` |
| **Railway** | Auto-detects Next.js |
| **Docker** | `next build && next start` |
| **Self-hosted** | PM2 + Nginx reverse proxy |

## License

MIT
