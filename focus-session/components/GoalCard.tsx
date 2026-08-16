import { GoalConfig } from '@/lib/categories';

interface GoalCardProps {
  goal: GoalConfig;
  selected: boolean;
  onSelect: (id: GoalConfig['id']) => void;
}

export default function GoalCard({ goal, selected, onSelect }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(goal.id)}
      aria-pressed={selected}
      className={`text-left p-5 rounded-xl2 border transition-all ${
        selected
          ? 'border-primary bg-primary-light shadow-ring'
          : 'border-line bg-white hover:border-primary/50 hover:shadow-soft'
      }`}
    >
      <span className="text-3xl" aria-hidden="true">
        {goal.emoji}
      </span>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink">{goal.label}</h3>
      <p className="mt-1 text-sm text-inkSoft">{goal.description}</p>
    </button>
  );
}
