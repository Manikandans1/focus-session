'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import GoalCard from '@/components/GoalCard';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import DurationSelector from '@/components/DurationSelector';
import { GOAL_LIST } from '@/lib/categories';
import { ContentType, DurationMinutes, Goal } from '@/types/video';

const STEP_LABELS = ['What do you need?', 'What do you want to watch?', 'How much time do you have?'];

export default function SelectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [duration, setDuration] = useState<DurationMinutes | null>(null);

  const canAdvance = useMemo(() => {
    if (step === 1) return goal !== null;
    if (step === 2) return contentType !== null;
    return duration !== null;
  }, [step, goal, contentType, duration]);

  function goNext() {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (goal && contentType && duration) {
      const params = new URLSearchParams({
        goal,
        contentType,
        durationMinutes: String(duration),
      });
      router.push(`/feed?${params.toString()}`);
    }
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="text-sm font-mono text-primary mb-2" aria-hidden="true">
        Step {step} of 3
      </p>
      <div className="flex gap-2 mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-line'}`}
          />
        ))}
      </div>

      <h1 className="font-display text-3xl font-semibold text-ink mb-8">{STEP_LABELS[step - 1]}</h1>

      {step === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GOAL_LIST.map((g) => (
            <GoalCard key={g.id} goal={g} selected={goal === g.id} onSelect={setGoal} />
          ))}
        </div>
      ) : null}

      {step === 2 ? <ContentTypeSelector value={contentType} onChange={setContentType} /> : null}

      {step === 3 ? <DurationSelector value={duration} onChange={setDuration} /> : null}

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-0 disabled:pointer-events-none"
        >
          Back
        </button>
        <button type="button" onClick={goNext} disabled={!canAdvance} className="btn-primary disabled:opacity-40">
          {step === 3 ? 'Find My Content' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
