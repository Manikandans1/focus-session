import { GOAL_CONFIG, GOAL_LIST, isValidGoal } from '@/lib/categories';

describe('goal configuration', () => {
  it('has a non-empty keyword list for every goal', () => {
    for (const goal of GOAL_LIST) {
      expect(goal.keywords.length).toBeGreaterThan(0);
      for (const keyword of goal.keywords) {
        expect(typeof keyword).toBe('string');
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it('exposes exactly the seven documented goals', () => {
    expect(Object.keys(GOAL_CONFIG).sort()).toEqual(
      [
        'LEARN_CODING',
        'CAREER',
        'BUSINESS',
        'KNOWLEDGE',
        'NEWS',
        'SELF_IMPROVEMENT',
        'RELAX',
      ].sort()
    );
  });
});

describe('isValidGoal', () => {
  it('accepts known goals', () => {
    expect(isValidGoal('LEARN_CODING')).toBe(true);
    expect(isValidGoal('RELAX')).toBe(true);
  });

  it('rejects unknown or malformed input', () => {
    expect(isValidGoal('NOT_A_GOAL')).toBe(false);
    expect(isValidGoal(undefined)).toBe(false);
    expect(isValidGoal(123)).toBe(false);
    expect(isValidGoal(null)).toBe(false);
  });
});
