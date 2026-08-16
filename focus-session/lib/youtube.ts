// Thin, server-only wrapper around the official YouTube Data API v3.
//
// Important limitation (see README "YouTube API / embedding considerations"):
// the Data API does not expose a reliable universal "this is a Short"
// boolean. We approximate Shorts using the documented `videoDuration=short`
// search parameter (YouTube's own "under 4 minutes" bucket) combined with a
// stricter local filter (<= 183 seconds, YouTube's current Shorts ceiling)
// and a "#shorts"-biased query. This is a heuristic, not a guarantee, and
// is intentionally conservative: content is excluded from the Shorts pool
// unless it plausibly qualifies, rather than mislabeling long-form videos.

import { Video } from '@/types/video';

const API_BASE = 'https://www.googleapis.com/youtube/v3';

// Shorts are currently capped at 3 minutes by YouTube. Kept as a named
// constant so the heuristic is easy to find and adjust later.
const SHORTS_MAX_SECONDS = 183;
// Never treat something under 15s as a usable standalone video/short.
const MIN_USABLE_SECONDS = 15;

interface YouTubeSearchItem {
  id?: { videoId?: string };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: { message?: string };
}

interface YouTubeVideoItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: { duration?: string };
}

interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[];
  error?: { message?: string };
}

export class YouTubeApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

function requireApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new YouTubeApiError('YOUTUBE_API_KEY is not configured on the server.');
  }
  return key;
}

async function searchVideoIds(
  query: string,
  opts: { videoDuration?: 'short' | 'medium' | 'long'; maxResults?: number }
): Promise<string[]> {
  const apiKey = requireApiKey();
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: query,
    maxResults: String(opts.maxResults ?? 8),
    safeSearch: 'strict',
    key: apiKey,
  });
  if (opts.videoDuration) params.set('videoDuration', opts.videoDuration);

  const res = await fetch(`${API_BASE}/search?${params.toString()}`, {
    // A short revalidation window avoids hammering the API for the exact
    // same query within a burst of requests (see README "API quota").
    next: { revalidate: 600 },
  });

  const data = (await res.json()) as YouTubeSearchResponse;
  if (!res.ok) {
    throw new YouTubeApiError(data.error?.message || `YouTube search failed (${res.status})`);
  }

  return (data.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));
}

async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideoItem[]> {
  if (videoIds.length === 0) return [];
  const apiKey = requireApiKey();
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: videoIds.join(','),
    key: apiKey,
  });

  const res = await fetch(`${API_BASE}/videos?${params.toString()}`, {
    next: { revalidate: 600 },
  });

  const data = (await res.json()) as YouTubeVideosResponse;
  if (!res.ok) {
    throw new YouTubeApiError(data.error?.message || `YouTube video lookup failed (${res.status})`);
  }

  return data.items ?? [];
}

function toVideo(item: YouTubeVideoItem, contentType: 'VIDEO' | 'SHORT', durationSeconds: number): Video {
  const thumb =
    item.snippet?.thumbnails?.high?.url ||
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.default?.url ||
    '';

  return {
    videoId: item.id,
    title: item.snippet?.title || 'Untitled',
    description: item.snippet?.description || '',
    thumbnail: thumb,
    channelName: item.snippet?.channelTitle || 'Unknown channel',
    durationSeconds,
    publishedAt: item.snippet?.publishedAt || '',
    contentType,
    embedUrl:
      contentType === 'SHORT'
        ? `https://www.youtube.com/embed/${item.id}`
        : `https://www.youtube.com/embed/${item.id}`,
  };
}

/**
 * Fetch a pool of candidate long-form videos for the given keywords.
 * Excludes anything that is Shorts-length so it doesn't get double counted.
 */
export async function fetchVideoCandidates(keywords: string[], perKeyword = 6): Promise<Video[]> {
  const { parseIsoDuration } = await import('@/lib/duration');
  const idBatches = await Promise.all(
    keywords.map((k) => searchVideoIds(k, { maxResults: perKeyword }))
  );
  const ids = Array.from(new Set(idBatches.flat()));
  const details = await fetchVideoDetails(ids);

  return details
    .map((item) => {
      const durationSeconds = parseIsoDuration(item.contentDetails?.duration || 'PT0S');
      return { item, durationSeconds };
    })
    .filter(({ durationSeconds }) => durationSeconds > SHORTS_MAX_SECONDS)
    .map(({ item, durationSeconds }) => toVideo(item, 'VIDEO', durationSeconds));
}

/**
 * Fetch a pool of candidate Shorts for the given keywords, using the
 * heuristic described at the top of this file.
 */
export async function fetchShortCandidates(keywords: string[], perKeyword = 6): Promise<Video[]> {
  const { parseIsoDuration } = await import('@/lib/duration');
  const shortsQueries = keywords.map((k) => `${k} #shorts`);
  const idBatches = await Promise.all(
    shortsQueries.map((k) => searchVideoIds(k, { videoDuration: 'short', maxResults: perKeyword }))
  );
  const ids = Array.from(new Set(idBatches.flat()));
  const details = await fetchVideoDetails(ids);

  return details
    .map((item) => {
      const durationSeconds = parseIsoDuration(item.contentDetails?.duration || 'PT0S');
      return { item, durationSeconds };
    })
    .filter(
      ({ durationSeconds }) => durationSeconds >= MIN_USABLE_SECONDS && durationSeconds <= SHORTS_MAX_SECONDS
    )
    .map(({ item, durationSeconds }) => toVideo(item, 'SHORT', durationSeconds));
}
