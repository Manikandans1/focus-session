interface ShortsPlayerProps {
  videoId: string;
  title: string;
}

/**
 * Portrait-style container for Shorts, still using YouTube's standard
 * supported iframe embed (there is no separate "Shorts embed" endpoint).
 */
export default function ShortsPlayer({ videoId, title }: ShortsPlayerProps) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });

  return (
    <div className="mx-auto w-full max-w-[380px] aspect-[9/16] rounded-xl2 overflow-hidden bg-black shadow-soft">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
