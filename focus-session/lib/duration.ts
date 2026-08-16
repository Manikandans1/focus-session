// Simple, bounded session-building algorithm.
//
// Goal: given a pool of candidate items (each with a duration) and a
// target duration, pick a subset whose total duration is as close as
// possible to the target WITHOUT significantly exceeding it.
//
// This intentionally stays a plain bounded 0/1-knapsack — not a general
// optimizer. It is isolated in this file so it can be swapped out or
// improved later without touching the API route or UI.

export interface DurationItem {
  id: string;
  durationSeconds: number;
}

export interface SessionResult {
  selectedIds: string[];
  totalSeconds: number;
  isPartial: boolean;
}

/** Format seconds as clean, testable minute output for the user-facing header. */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/** Format seconds as m:ss (e.g. 245 -> "4:05"). Used for player/progress UI. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse a YouTube "PT#H#M#S" ISO-8601 duration string into whole seconds.
 * Returns 0 for anything unparseable rather than throwing, since a single
 * malformed item should not break an entire session build.
 */
export function parseIsoDuration(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const seconds = parseInt(match[3] ?? '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Select the subset of `items` whose total duration best approaches
 * `targetSeconds` without exceeding `capacitySeconds`. Implemented as a
 * bounded 0/1 knapsack (item count is always small — a page of search
 * results — so a full DP table is cheap and deterministic).
 */
function knapsackClosestSubset(
  items: DurationItem[],
  capacitySeconds: number
): { selectedIds: string[]; total: number } {
  const capacity = Math.max(0, Math.floor(capacitySeconds));
  const n = items.length;

  if (n === 0 || capacity === 0) {
    return { selectedIds: [], total: 0 };
  }

  // dp[i][c] = best achievable total duration using the first i items
  // with a budget of c seconds.
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const w = Math.min(items[i - 1].durationSeconds, capacity);
    for (let c = 0; c <= capacity; c++) {
      const without = dp[i - 1][c];
      const withItem = w <= c ? dp[i - 1][c - w] + items[i - 1].durationSeconds : -1;
      dp[i][c] = Math.max(without, withItem);
    }
  }

  // Walk back to find which items were kept.
  const selected: DurationItem[] = [];
  let c = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][c] !== dp[i - 1][c]) {
      selected.push(items[i - 1]);
      c -= Math.min(items[i - 1].durationSeconds, capacity);
    }
  }

  return {
    selectedIds: selected.map((s) => s.id),
    total: dp[n][capacity],
  };
}

/**
 * Build a focused session from a candidate pool.
 *
 * Strategy:
 * 1. Drop any single item that is already far longer than the whole
 *    requested session (never hand back a 40-minute video for a
 *    5-minute request).
 * 2. Try to fill as close to the target as possible without going over.
 * 3. If that leaves the session mostly empty (not enough short content
 *    to fill the time), allow a small overage tolerance as a fallback
 *    and flag the result as partial so the UI can be honest about it.
 */
export function buildSession(
  candidates: DurationItem[],
  targetSeconds: number
): SessionResult {
  if (targetSeconds <= 0 || candidates.length === 0) {
    return { selectedIds: [], totalSeconds: 0, isPartial: candidates.length === 0 };
  }

  // Step 1: never consider a single item that blows past the whole session.
  const maxSingleItem = Math.max(targetSeconds * 1.1, targetSeconds + 60);
  const pool = candidates.filter((c) => c.durationSeconds > 0 && c.durationSeconds <= maxSingleItem);

  if (pool.length === 0) {
    return { selectedIds: [], totalSeconds: 0, isPartial: true };
  }

  // Step 2: fill as close as possible without exceeding the target.
  const primary = knapsackClosestSubset(pool, targetSeconds);

  const goodEnough = primary.total >= targetSeconds * 0.7;
  if (goodEnough) {
    return {
      selectedIds: primary.selectedIds,
      totalSeconds: primary.total,
      isPartial: false,
    };
  }

  // Step 3: fallback — allow a small overage (up to 20%) so a thin pool of
  // content still produces a reasonable session, and mark it partial.
  const fallback = knapsackClosestSubset(pool, targetSeconds * 1.2);
  const best = fallback.total > primary.total ? fallback : primary;

  return {
    selectedIds: best.selectedIds,
    totalSeconds: best.total,
    isPartial: best.total < targetSeconds * 0.9,
  };
}
