import { formatDuration } from '@/lib/duration';

interface SessionProgressProps {
  totalSeconds: number;
  elapsedSeconds: number;
}

/**
 * Approximate session progress. We do not implement precise cross-video
 * playback tracking (see spec section 23) — elapsed time is the sum of
 * durations of items already advanced past, which is accurate enough to
 * orient the user without complicated instrumentation.
 */
export default function SessionProgress({ totalSeconds, elapsedSeconds }: SessionProgressProps) {
  const clampedElapsed = Math.min(elapsedSeconds, totalSeconds);
  const remaining = Math.max(totalSeconds - clampedElapsed, 0);
  const pct = totalSeconds > 0 ? Math.min(100, Math.round((clampedElapsed / totalSeconds) * 100)) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="flex items-center gap-4" role="status" aria-live="polite">
      <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#DBE2DF" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#0F766E"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div className="font-mono text-sm">
        <p className="text-ink font-semibold">{formatDuration(clampedElapsed)} watched</p>
        <p className="text-muted">{formatDuration(remaining)} remaining</p>
      </div>
    </div>
  );
}
