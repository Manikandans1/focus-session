interface AdPlaceholderProps {
  /** Visual variant so the same component reads correctly in different slots. */
  variant?: 'banner' | 'inline';
  className?: string;
}

/**
 * Placeholder for a future Google AdSense unit.
 *
 * Intentionally inert: no click handlers, no fake creative, no motion that
 * could be mistaken for content. Swap the contents of this component for
 * the real AdSense `<ins>` tag once the site qualifies — nothing else in
 * the app needs to change.
 */
export default function AdPlaceholder({ variant = 'inline', className = '' }: AdPlaceholderProps) {
  const height = variant === 'banner' ? 'h-24' : 'h-40';
  return (
    <div
      role="complementary"
      aria-label="Advertisement placeholder"
      className={`w-full ${height} rounded-xl2 border border-dashed border-line bg-canvasDim flex items-center justify-center text-xs text-muted ${className}`}
    >
      Ad space
    </div>
  );
}
