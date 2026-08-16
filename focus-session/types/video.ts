// Core domain types for Focus Session.
// Keep this file the single source of truth for shared shapes.

export type Goal =
  | 'LEARN_CODING'
  | 'CAREER'
  | 'BUSINESS'
  | 'KNOWLEDGE'
  | 'NEWS'
  | 'SELF_IMPROVEMENT'
  | 'RELAX';

export type ContentType = 'VIDEO' | 'SHORT' | 'BOTH';

export type DurationMinutes = 5 | 10 | 20 | 30;

export const GOALS: Goal[] = [
  'LEARN_CODING',
  'CAREER',
  'BUSINESS',
  'KNOWLEDGE',
  'NEWS',
  'SELF_IMPROVEMENT',
  'RELAX',
];

export const CONTENT_TYPES: ContentType[] = ['VIDEO', 'SHORT', 'BOTH'];

export const DURATIONS: DurationMinutes[] = [5, 10, 20, 30];

export interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelName: string;
  durationSeconds: number;
  publishedAt: string;
  contentType: 'VIDEO' | 'SHORT';
  embedUrl: string;
}

export interface SearchRequestBody {
  goal: Goal;
  contentType: ContentType;
  durationMinutes: DurationMinutes;
}

export interface SearchResponseBody {
  success: true;
  requestedDurationMinutes: number;
  selectedDurationMinutes: number;
  contentType: ContentType;
  goal: Goal;
  videos: Video[];
  isPartial: boolean;
  message?: string;
}

export interface SearchErrorBody {
  success: false;
  error: string;
}

export type SearchApiResponse = SearchResponseBody | SearchErrorBody;

// A single user selection made while walking through /select.
export interface SessionSelection {
  goal: Goal | null;
  contentType: ContentType | null;
  durationMinutes: DurationMinutes | null;
}
