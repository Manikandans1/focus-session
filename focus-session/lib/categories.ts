// Central, easily-editable mapping of goals to human-facing labels and
// YouTube search keywords. Adding a new goal is a matter of extending
// this file only — no other file needs to know about the keyword list.

import { Goal } from '@/types/video';

export interface GoalConfig {
  id: Goal;
  label: string;
  emoji: string;
  description: string;
  keywords: string[];
}

export const GOAL_CONFIG: Record<Goal, GoalConfig> = {
  LEARN_CODING: {
    id: 'LEARN_CODING',
    label: 'Learn Coding',
    emoji: '💻',
    description: 'Tutorials and walkthroughs to build real skills.',
    keywords: ['coding tutorial', 'programming tutorial', 'learn programming'],
  },
  CAREER: {
    id: 'CAREER',
    label: 'Career',
    emoji: '💼',
    description: 'Interview prep and career-building advice.',
    keywords: ['career advice', 'interview preparation', 'career skills'],
  },
  BUSINESS: {
    id: 'BUSINESS',
    label: 'Business',
    emoji: '💰',
    description: 'Ideas, strategy, and entrepreneurship.',
    keywords: ['business ideas', 'entrepreneurship', 'business education'],
  },
  KNOWLEDGE: {
    id: 'KNOWLEDGE',
    label: 'Knowledge',
    emoji: '🧠',
    description: 'Interesting facts and general learning.',
    keywords: ['interesting facts', 'science knowledge', 'educational videos'],
  },
  NEWS: {
    id: 'NEWS',
    label: 'News',
    emoji: '📰',
    description: 'Catch up on what is happening right now.',
    keywords: ['latest technology news', 'latest business news', 'latest news'],
  },
  SELF_IMPROVEMENT: {
    id: 'SELF_IMPROVEMENT',
    label: 'Self Improvement',
    emoji: '💪',
    description: 'Productivity, habits, and communication.',
    keywords: ['productivity', 'self improvement', 'communication skills'],
  },
  RELAX: {
    id: 'RELAX',
    label: 'Relax',
    emoji: '😌',
    description: 'Comedy, travel, and light entertainment.',
    keywords: ['comedy', 'interesting videos', 'travel', 'entertainment'],
  },
};

export const GOAL_LIST: GoalConfig[] = Object.values(GOAL_CONFIG);

export function isValidGoal(value: unknown): value is Goal {
  return typeof value === 'string' && value in GOAL_CONFIG;
}
