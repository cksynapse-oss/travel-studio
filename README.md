# Travel Studio

**The experience layer for physical travel.**

Travel Studio is an experimental interface for exploring travel through people, places, experiences, and the artifacts travelers leave behind. The current prototype is set in **Manali, India**.

> **Status:** Prototype / work in progress. This repository demonstrates an interface concept; it should not be treated as a production travel-booking service.

## What this explores

Travel is often represented as a list of destinations and transactions. Travel Studio explores a more contextual experience: connecting a place with the people, experiences, and memories around it.

## Technology

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Motion, Lucide icons, and Base UI
- Vercel Analytics (production only)

## Run locally

**Requirements:** Node.js and npm.

```bash
git clone https://github.com/cksynapse-oss/travel-studio.git
cd travel-studio
npm ci
npm run dev
```

Open `http://localhost:3000` in your browser.

Additional commands:

```bash
npm run build  # production build
npm run start  # serve a production build
npm run lint   # run ESLint
```

## Code map

| Location | Purpose |
| --- | --- |
| `app/` | Next.js pages, layout, and global styles |
| `components/` | Application interface components, including the app shell |
| `lib/` | Shared logic and application state |
| `public/` | Static assets |

The home page mounts `AppShell` inside `StoreProvider`.

## Project notes

This is an exploratory project, not a claim that all planned experiences or integrations are implemented. The repository's code is the source of truth for currently available behavior.

## Contributing

Ideas, issues, and feedback are welcome. Before proposing a large change, open an issue to discuss the intended behavior.
