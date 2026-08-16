interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Finding useful content for you...' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="w-full">
      <p className="text-center font-display text-lg text-ink mb-8">{message}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse" aria-hidden="true">
            <div className="aspect-video bg-canvasDim" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-canvasDim rounded w-4/5" />
              <div className="h-3 bg-canvasDim rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading your session</span>
    </div>
  );
}
