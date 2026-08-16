import { ContentType } from '@/types/video';

const OPTIONS: { id: ContentType; label: string; emoji: string; hint: string }[] = [
  { id: 'VIDEO', label: 'Videos', emoji: '🎬', hint: 'Regular-length videos' },
  { id: 'SHORT', label: 'Shorts', emoji: '⚡', hint: 'Quick, vertical clips' },
  { id: 'BOTH', label: 'Both', emoji: '🔀', hint: 'A mix of the two' },
];

interface ContentTypeSelectorProps {
  value: ContentType | null;
  onChange: (value: ContentType) => void;
}

export default function ContentTypeSelector({ value, onChange }: ContentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="What do you want to watch?">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={`p-5 rounded-xl2 border text-left transition-all ${
              selected
                ? 'border-primary bg-primary-light shadow-ring'
                : 'border-line bg-white hover:border-primary/50 hover:shadow-soft'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {opt.emoji}
            </span>
            <h3 className="mt-2 font-display text-base font-semibold text-ink">{opt.label}</h3>
            <p className="mt-1 text-sm text-inkSoft">{opt.hint}</p>
          </button>
        );
      })}
    </div>
  );
}
