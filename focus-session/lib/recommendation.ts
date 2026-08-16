// Orchestrates a single "build me a session" request:
// goal -> keywords -> YouTube candidates -> duration-bounded selection.
//
// Kept deliberately simple per V1 scope: no ranking model, no
// personalization, just search + filter + fit-to-duration.

import { GOAL_CONFIG } from '@/lib/categories';
import { buildSession, DurationItem } from '@/lib/duration';
import { fetchShortCandidates, fetchVideoCandidates } from '@/lib/youtube';
import { ContentType, Goal, SearchResponseBody, Video } from '@/types/video';

interface CacheEntry {
  expiresAt: number;
  data: SearchResponseBody;
}

// Simple in-memory, single-process cache to cut down on repeated identical
// searches within a short window. Intentionally not a database or Redis —
// see spec section 38 ("do not over-engineer caching"). This resets on
// every server restart/deploy, which is an acceptable V1 tradeoff.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

function cacheKey(goal: Goal, contentType: ContentType, durationMinutes: number): string {
  return `${goal}:${contentType}:${durationMinutes}`;
}

function dedupeByVideoId(videos: Video[]): Video[] {
  const seen = new Set<string>();
  const result: Video[] = [];
  for (const v of videos) {
    if (!seen.has(v.videoId)) {
      seen.add(v.videoId);
      result.push(v);
    }
  }
  return result;
}

export async function buildRecommendation(
  goal: Goal,
  contentType: ContentType,
  durationMinutes: number
): Promise<SearchResponseBody> {
  const key = cacheKey(goal, contentType, durationMinutes);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const keywords = GOAL_CONFIG[goal].keywords;
  const targetSeconds = durationMinutes * 60;

  let pool: Video[] = [];
  if (contentType === 'VIDEO') {
    pool = await fetchVideoCandidates(keywords);
  } else if (contentType === 'SHORT') {
    pool = await fetchShortCandidates(keywords);
  } else {
    const [videos, shorts] = await Promise.all([
      fetchVideoCandidates(keywords),
      fetchShortCandidates(keywords),
    ]);
    pool = [...videos, ...shorts];
  }

  pool = dedupeByVideoId(pool);

  const durationItems: DurationItem[] = pool.map((v) => ({
    id: v.videoId,
    durationSeconds: v.durationSeconds,
  }));

  const session = buildSession(durationItems, targetSeconds);
  const selectedSet = new Set(session.selectedIds);
  const selectedVideos = pool
    .filter((v) => selectedSet.has(v.videoId))
    // Keep a sensible watch order: longer-form anchors first, short
    // breathers interleaved is a nice-to-have for later — V1 just sorts
    // by descending duration so the session doesn't front-load filler.
    .sort((a, b) => b.durationSeconds - a.durationSeconds);

  const response: SearchResponseBody = {
    success: true,
    requestedDurationMinutes: durationMinutes,
    selectedDurationMinutes: Math.round(session.totalSeconds / 60),
    contentType,
    goal,
    videos: selectedVideos,
    isPartial: session.isPartial || selectedVideos.length === 0,
    message:
      session.isPartial || selectedVideos.length === 0
        ? "We couldn't find enough content to fill your full session, so we've selected the closest matches."
        : undefined,
  };

  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, data: response });
  return response;
}
