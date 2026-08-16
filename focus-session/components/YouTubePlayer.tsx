interface YouTubePlayerProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  onEnded?: () => void;
}

/**
 * Official YouTube iframe embed, standard responsive aspect ratio.
 * We do not download, rehost, or otherwise touch the underlying video —
 * playback happens entirely inside YouTube's supported embedded player.
 */
export default function YouTubePlayer({ videoId, title, autoplay = false, onEnded }: YouTubePlayerProps) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    autoplay: autoplay ? '1' : '0',
  });

  return (
    <div className="relative w-full aspect-video rounded-xl2 overflow-hidden bg-black shadow-soft">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => {
          // We cannot reliably detect "ended" from a same-origin-restricted
          // iframe without the full IFrame API + postMessage handshake.
          // V1 keeps this simple — the "Next"/"Complete" controls are
          // driven by explicit user action instead (see SessionProgress).
          void onEnded;
        }}
      />
    </div>
  );
}
