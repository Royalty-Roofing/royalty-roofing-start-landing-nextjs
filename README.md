# Royalty Roofing — Start Landing (Next.js)

Next.js (App Router) port of the original Vite/React landing page. Visually and
behaviorally identical to the original; rebuilt on Next.js for Vercel.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Radix UI / shadcn components, framer-motion, lucide-react

## What changed from the original
- Vite → Next.js App Router (`src/app/`). Single route `/`, 404 → `not-found`.
- Removed Manus tooling (vite-plugin-manus-runtime, debug collector, storage proxy),
  the Express static server, wouter router, and unused OAuth/Map/ManusDialog scaffolding.
- Tracking: the only Google tag is Google Tag Manager, loaded in `src/app/layout.tsx` from
  `NEXT_PUBLIC_GTM_ID`. GA4, Google Ads and CallRail load through GTM. The site pushes two
  dataLayer events (`generate_lead` and `tel_click`) from `src/lib/gtm.ts`.
- Images localized: the page no longer depends on the temporary manuscdn.com CDN.
  All assets live in `public/images/`.
- `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`.

## Environment variables (optional — see `.env.example`)
- `NEXT_PUBLIC_FORM_WEBHOOK_URL` — lead webhook (GoHighLevel/LeadConnector). Falls back
  to the original hardcoded URL if unset.
- `NEXT_PUBLIC_ANALYTICS_ENDPOINT` / `NEXT_PUBLIC_ANALYTICS_WEBSITE_ID` — optional umami.

## Develop / build
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy on Vercel
Import the repo in Vercel. Framework preset = Next.js (auto-detected). No `vercel.json`
needed. Set the env vars above if you want to override the defaults.
