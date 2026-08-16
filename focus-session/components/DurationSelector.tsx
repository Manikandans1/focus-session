import { DURATIONS, DurationMinutes } from '@/types/video';

interface DurationSelectorProps {
  value: DurationMinutes | null;
  onChange: (value: DurationMinutes) => void;
}

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="radiogroup" aria-label="How much time do you have?">
      {DURATIONS.map((mins) => {
        const selected = value === mins;
        return (
          <button
            key={mins}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mins)}
            className={`py-6 rounded-xl2 border text-center transition-all font-mono ${
              selected
                ? 'border-primary bg-primary-light shadow-ring'
                : 'border-line bg-white hover:border-primary/50 hover:shadow-soft'
            }`}
          >
            <div className="text-2xl font-semibold text-ink">{mins}</div>
            <div className="text-xs uppercase tracking-wide text-muted mt-1">minutes</div>
          </button>
        );
      })}
    </div>
  );
}
