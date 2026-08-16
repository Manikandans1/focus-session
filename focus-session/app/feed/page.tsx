'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import SessionProgress from '@/components/SessionProgress';
import VideoCard from '@/components/VideoCard';
import YouTubePlayer from '@/components/YouTubePlayer';
import ShortsPlayer from '@/components/ShortsPlayer';
import AdPlaceholder from '@/components/AdPlaceholder';
import { isValidGoal, GOAL_CONFIG } from '@/lib/categories';
import { CONTENT_TYPES, DURATIONS, SearchApiResponse, SearchResponseBody } from '@/types/video';

type Feedback = 'up' | 'down' | 'skip';

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16"><LoadingState /></div>}>
      <FeedContent />
    </Suspense>
  );
}

function FeedContent() {
  const searchParams = useSearchParams();
  const goalParam = searchParams.get('goal');
  const contentTypeParam = searchParams.get('contentType');
  const durationParam = Number(searchParams.get('durationMinutes'));

  const validRequest =
    isValidGoal(goalParam) &&
    CONTENT_TYPES.includes((contentTypeParam ?? '') as never) &&
    DURATIONS.includes(durationParam as never);

  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState<SearchResponseBody | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [completed, setCompleted] = useState(false);

  const fetchSession = useCallback(async () => {
    if (!validRequest) return;
    setStatus('loading');
    setCompleted(false);
    setActiveIndex(0);
    try {
      const res = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalParam,
          contentType: contentTypeParam,
          durationMinutes: durationParam,
        }),
      });
      const json = (await res.json()) as SearchApiResponse;
      if (!res.ok || !json.success) {
        setErrorMessage(!json.success ? json.error : "We couldn't find content right now.");
        setStatus('error');
        return;
      }
      if (json.videos.length === 0) {
        setErrorMessage("We couldn't find enough content for your selected session.");
        setStatus('error');
        return;
      }
      setData(json);
      setStatus('success');
    } catch {
      setErrorMessage("We couldn't find content right now.");
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalParam, contentTypeParam, durationParam, validRequest]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (!validRequest) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <ErrorState message="That session link looks incomplete." actionLabel="Choose Options" />
        <div className="text-center mt-2">
          <Link href="/select" className="text-primary underline text-sm">
            Go to selection
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <LoadingState />
      </div>
    );
  }

  if (status === 'error' || !data) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <ErrorState message={errorMessage} actionLabel="Try Again" onAction={fetchSession} />
        <div className="text-center mt-2">
          <Link href="/select" className="text-primary underline text-sm">
            Try Different Options
          </Link>
        </div>
      </div>
    );
  }

  const { videos, goal, contentType, requestedDurationMinutes, selectedDurationMinutes, isPartial, message } = data;
  const totalSeconds = videos.reduce((sum, v) => sum + v.durationSeconds, 0);
  const elapsedSeconds = videos.slice(0, activeIndex).reduce((sum, v) => sum + v.durationSeconds, 0);
  const active = videos[activeIndex];
  const isShortsSession = contentType === 'SHORT';

  function setActiveFeedback(value: Feedback) {
    setFeedback((prev) => ({ ...prev, [active.videoId]: value }));
  }

  function advance() {
    if (activeIndex >= videos.length - 1) {
      setCompleted(true);
      return;
    }
    setActiveIndex((i) => i + 1);
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-5xl" aria-hidden="true">
          🎯
        </p>
        <h1 className="font-display text-2xl font-semibold text-ink mt-4">Session Complete</h1>
        <p className="text-inkSoft mt-2">You spent your planned time watching selected content.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/select" className="btn-primary">
            Start Another Session
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-primary">
          {isShortsSession ? '⚡ Your' : contentType === 'BOTH' ? '🔀 Your' : '🎬 Your'} {selectedDurationMinutes}-minute
          session
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink mt-1">{GOAL_CONFIG[goal].label}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <SessionProgress totalSeconds={totalSeconds} elapsedSeconds={elapsedSeconds} />
          <dl className="text-sm text-inkSoft grid grid-cols-3 gap-x-6">
            <div>
              <dt className="text-muted">Content</dt>
              <dd className="font-medium text-ink capitalize">{contentType.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-muted">Requested</dt>
              <dd className="font-medium text-ink">{requestedDurationMinutes} min</dd>
            </div>
            <div>
              <dt className="text-muted">Selected</dt>
              <dd className="font-medium text-ink">{selectedDurationMinutes} min</dd>
            </div>
          </dl>
        </div>
        {isPartial && message ? (
          <p className="mt-4 text-sm text-amber-dark bg-amber-light border border-amber/40 rounded-xl2 px-4 py-3">
            {message}
          </p>
        ) : null}
      </header>

      <section aria-label="Now playing" className="mb-6">
        {isShortsSession ? (
          <ShortsPlayer videoId={active.videoId} title={active.title} />
        ) : (
          <YouTubePlayer videoId={active.videoId} title={active.title} />
        )}
        <div className="mt-3">
          <h2 className="font-display text-lg font-semibold text-ink">{active.title}</h2>
          <p className="text-sm text-inkSoft">{active.channelName}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <FeedbackButton
            label="👍 Useful"
            active={feedback[active.videoId] === 'up'}
            onClick={() => setActiveFeedback('up')}
          />
          <FeedbackButton
            label="👎 Not useful"
            active={feedback[active.videoId] === 'down'}
            onClick={() => setActiveFeedback('down')}
          />
          <FeedbackButton
            label="Skip"
            active={feedback[active.videoId] === 'skip'}
            onClick={() => setActiveFeedback('skip')}
          />
          <button type="button" onClick={advance} className="btn-primary ml-auto">
            {activeIndex >= videos.length - 1 ? 'Finish Session' : isShortsSession ? 'Next Short' : 'Next Video'}
          </button>
        </div>
      </section>

      <section className="my-8">
        <AdPlaceholder />
      </section>

      <section aria-label="Session queue">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">In this session</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <VideoCard key={v.videoId} video={v} goal={goal} active={i === activeIndex} onSelect={() => setActiveIndex(i)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeedbackButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'border-primary bg-primary-light text-primary' : 'border-line bg-white text-inkSoft hover:border-primary/50'
      }`}
    >
      {label}
    </button>
  );
}
