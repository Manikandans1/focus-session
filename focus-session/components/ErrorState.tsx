interface ErrorStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorState({ message, actionLabel = 'Try Again', onAction }: ErrorStateProps) {
  return (
    <div role="alert" className="max-w-md mx-auto text-center py-16">
      <p className="text-4xl" aria-hidden="true">
        ⚠️
      </p>
      <p className="mt-4 text-ink font-medium">{message}</p>
      {onAction ? (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
