import { NextRequest, NextResponse } from 'next/server';
import { isValidGoal } from '@/lib/categories';
import { buildRecommendation } from '@/lib/recommendation';
import { YouTubeApiError } from '@/lib/youtube';
import { CONTENT_TYPES, DURATIONS, SearchErrorBody } from '@/types/video';

export const dynamic = 'force-dynamic';

function badRequest(message: string): NextResponse<SearchErrorBody> {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON.');
  }

  if (typeof body !== 'object' || body === null) {
    return badRequest('Request body must be a JSON object.');
  }

  const { goal, contentType, durationMinutes } = body as Record<string, unknown>;

  if (!isValidGoal(goal)) {
    return badRequest('Invalid or missing "goal".');
  }
  if (typeof contentType !== 'string' || !CONTENT_TYPES.includes(contentType as never)) {
    return badRequest('Invalid or missing "contentType". Expected VIDEO, SHORT, or BOTH.');
  }
  if (typeof durationMinutes !== 'number' || !DURATIONS.includes(durationMinutes as never)) {
    return badRequest('Invalid or missing "durationMinutes". Expected 5, 10, 20, or 30.');
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error:
          'YouTube API is not configured on this server. Add YOUTUBE_API_KEY to your environment (see .env.example) to enable real content.',
      },
      { status: 503 }
    );
  }

  try {
    const result = await buildRecommendation(
      goal,
      contentType as 'VIDEO' | 'SHORT' | 'BOTH',
      durationMinutes as 5 | 10 | 20 | 30
    );
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof YouTubeApiError) {
      const quotaLike = /quota/i.test(err.message);
      return NextResponse.json(
        {
          success: false,
          error: quotaLike
            ? "We've hit our YouTube API limit for now. Please try again shortly."
            : "We couldn't find content right now.",
        },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { success: false, error: "We couldn't find content right now." },
      { status: 500 }
    );
  }
}
