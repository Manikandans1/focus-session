import Image from 'next/image';
import { GOAL_CONFIG } from '@/lib/categories';
import { formatDuration } from '@/lib/duration';
import { Goal, Video } from '@/types/video';

interface VideoCardProps {
  video: Video;
  goal: Goal;
  active?: boolean;
  onSelect?: () => void;
}

export default function VideoCard({ video, goal, active = false, onSelect }: VideoCardProps) {
  const Wrapper = onSelect ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onSelect}
      className={`card w-full text-left overflow-hidden flex flex-col ${
        active ? 'ring-2 ring-primary' : ''
      } ${onSelect ? 'hover:shadow-none transition-shadow' : ''}`}
    >
      <div className="relative w-full aspect-video bg-canvasDim">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover"
          />
        ) : null}
        <span className="absolute bottom-2 right-2 rounded bg-ink/80 text-white text-xs font-mono px-1.5 py-0.5">
          {formatDuration(video.durationSeconds)}
        </span>
        <span className="absolute top-2 left-2 rounded-full bg-white/90 text-ink text-xs font-medium px-2 py-0.5">
          {video.contentType === 'SHORT' ? '⚡ Short' : '🎬 Video'}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h3 className="font-display text-base font-semibold text-ink line-clamp-2">{video.title}</h3>
        <p className="text-sm text-inkSoft">{video.channelName}</p>
        <p className="text-xs text-muted mt-2">Recommended because you selected {GOAL_CONFIG[goal].label}.</p>
      </div>
    </Wrapper>
  );
}
