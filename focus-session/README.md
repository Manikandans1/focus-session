# Focus Session

**Stop scrolling. Start watching with purpose.**

Focus Session helps people decide what to watch on YouTube instead of scrolling
aimlessly. Instead of "what do you want to watch?", it asks:

1. **What do you need right now?** (a goal — coding, career, business, knowledge, news, self-improvement, or relax)
2. **What do you want to watch?** (Videos, Shorts, or Both)
3. **How much time do you have?** (5, 10, 20, or 30 minutes)

It then searches YouTube, picks a small set of videos/Shorts whose combined
length fits the requested time, and lets the user watch them without leaving
the site, using YouTube's own supported embedded player.

This is a **V1 / MVP**. There is intentionally no AI, no database, no user
accounts, and no complex personalization — see "Future improvements" below.

---

## 1. What the application does

- Walks the user through a 3-step selection flow (`/select`).
- Calls the official YouTube Data API v3 to search for content matching the
  selected goal's keywords.
- Filters and fits the results to the requested time budget using a simple,
  bounded selection algorithm (`lib/duration.ts`).
- Plays the resulting session inside the site via YouTube's iframe embed —
  no downloading, rehosting, or scraping.
- Shows session progress, lightweight 👍/👎/skip feedback, and a completion
  screen.

## 2. Technology used

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **YouTube Data API v3** for search and metadata
- No database — React state, the URL, and `sessionStorage`/browser memory only
- **Jest** + **ts-jest** for the core algorithm's unit tests

## 3. How to install

```bash
npm install
```

## 4. How to get a YouTube API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Enable **YouTube Data API v3** under "APIs & Services" → "Library".
4. Go to "APIs & Services" → "Credentials" → "Create Credentials" → "API key".
5. (Recommended) Restrict the key to the YouTube Data API v3 and to your
   server's IP/domain where possible.

## 5. Environment variables

Copy the example file and fill in your key:

```bash
cp .env.example .env.local
```

`.env.local`:

```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

The key is **only ever read on the server** (inside `lib/youtube.ts` and the
`/api/youtube/search` route handler) and is never sent to the browser.

## 6. How to run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

If `YOUTUBE_API_KEY` is not set, the `/api/youtube/search` endpoint returns a
clear 503 error explaining that the server isn't configured yet, rather than
pretending to return real results — the app does not silently fall back to
fake data in production. (See section 12, "Development vs. production".)

## 7. How the recommendation calculation works

1. The client posts `{ goal, contentType, durationMinutes }` to
   `POST /api/youtube/search`.
2. The server validates all three fields against a strict allow-list
   (`lib/categories.ts`, `types/video.ts`) — it never trusts client input.
3. `lib/categories.ts` maps the goal to 3–4 plain-text search keywords.
4. `lib/youtube.ts` calls the YouTube Data API's `search` endpoint for each
   keyword, then `videos` for full metadata (title, channel, thumbnail,
   ISO-8601 duration) on the combined, de-duplicated result set.
5. `lib/duration.ts` runs a small, bounded 0/1-knapsack over the candidate
   pool to pick the subset whose total duration best fits the requested time
   **without exceeding it significantly**. If the best fit still falls short
   (not enough content available), it retries with a small overage allowance
   and marks the session `isPartial` so the UI can say so honestly.
6. `lib/recommendation.ts` orchestrates steps 3–5, dedupes, sorts the final
   list, and caches the result in memory for 10 minutes per
   `goal:contentType:durationMinutes` combination to reduce API quota use.

This is a deliberately simple algorithm (see spec section 12) — not a
recommendation engine. It lives entirely in `lib/duration.ts` so it can be
swapped for something smarter later without touching the API route or UI.

## 8. How Shorts mode works

The YouTube Data API does not expose a universal, reliable "this is a Short"
flag. `lib/youtube.ts` approximates Shorts by combining:

- YouTube's own `videoDuration=short` search parameter (its "under 4 minutes"
  bucket), and
- a `#shorts`-biased search query, and
- a strict local filter to ≤ 183 seconds (YouTube's current Shorts length
  ceiling).

This is a **heuristic, not a guarantee**, and it is intentionally
conservative: content is left out of the Shorts pool rather than risking a
long-form video being mislabeled as a Short. This limitation is documented
directly in `lib/youtube.ts`.

## 9. How to build for production

```bash
npm run build
npm start
```

`npm run build` must succeed with no TypeScript errors before shipping.

## 10. How to deploy

Any platform that supports Next.js server functions works (Vercel, a Node
server, etc.):

1. Set `YOUTUBE_API_KEY` as an environment variable on the platform.
2. Run `npm run build` then `npm start` (or let the platform run these for
   you, e.g. Vercel does this automatically on push).
3. Update `metadataBase` in `app/layout.tsx` and the base URL in
   `app/sitemap.ts` / `public/robots.txt` to your real production domain.

## 11. Important YouTube API / embedding considerations

- Only the official YouTube Data API v3 and YouTube's official iframe embed
  are used. The app never downloads, stores, rehosts, or scrapes video
  content.
- The API key is server-side only.
- `lib/recommendation.ts` includes a simple in-memory cache to avoid
  repeating identical searches within a short window — see spec section 38.
  This cache resets on server restart; it is intentionally not backed by
  Redis or a database for V1.
- If the API quota is exceeded or a request fails, the API route returns a
  friendly, non-technical error message — never a raw stack trace.
- Shorts identification is a documented heuristic (see section 8 above).

## 12. Development vs. production

If `YOUTUBE_API_KEY` is missing, the API route returns a clear configuration
error instead of fake data. There is no mock mode baked into the production
build — this keeps the app honest about what's really happening.

## 13. Testing

```bash
npm test
```

Covers the core, spec-critical logic:

- Duration calculation (e.g. 8 + 12 = 20 minutes; Shorts summing to ~5
  minutes without significant overage)
- Never selecting a single item that dwarfs the requested session
- Partial-session flagging when there isn't enough content
- Goal → keyword mapping integrity
- Input validation (`isValidGoal`)

## 14. Project structure

```
app/
  page.tsx                     Homepage
  select/page.tsx               3-step selection flow
  feed/page.tsx                 Session player + queue
  about/page.tsx
  privacy/page.tsx
  terms/page.tsx
  sitemap.ts
  api/youtube/search/route.ts   Server-side search + session-building endpoint
components/                     Header, Footer, GoalCard, ContentTypeSelector,
                                 DurationSelector, VideoCard, YouTubePlayer,
                                 ShortsPlayer, SessionProgress, LoadingState,
                                 ErrorState, AdPlaceholder
lib/
  youtube.ts                    YouTube Data API client (server-only)
  recommendation.ts             Orchestrates goal -> keywords -> session
  categories.ts                 Goal -> keyword configuration (edit here)
  duration.ts                   Session-building algorithm + unit tests
types/video.ts                  Shared TypeScript types
```

## 15. Future improvements (not in V1)

- **V2** — better filtering, watch history
- **V3** — user accounts, database
- **V4** — personalization
- **V5** — AI-assisted recommendations
- **V6** — mobile application
- **V7** — advanced analytics
- **V8** — advanced monetization

None of these are implemented yet on purpose — V1's job is to validate the
core idea with real users first.
