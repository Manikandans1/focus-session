import { buildSession, formatDuration, parseIsoDuration, secondsToMinutes } from '@/lib/duration';

describe('parseIsoDuration', () => {
  it('parses minutes and seconds', () => {
    expect(parseIsoDuration('PT8M')).toBe(480);
    expect(parseIsoDuration('PT45S')).toBe(45);
    expect(parseIsoDuration('PT1H2M3S')).toBe(3723);
  });

  it('returns 0 for unparseable input', () => {
    expect(parseIsoDuration('not-a-duration')).toBe(0);
  });
});

describe('formatDuration / secondsToMinutes', () => {
  it('formats seconds as m:ss', () => {
    expect(formatDuration(245)).toBe('4:05');
    expect(formatDuration(0)).toBe('0:00');
  });

  it('rounds seconds to whole minutes', () => {
    expect(secondsToMinutes(1190)).toBe(20);
  });
});

describe('buildSession — video-length combinations', () => {
  it('selects 8 + 12 minutes for a 20 minute request', () => {
    const candidates = [
      { id: 'A', durationSeconds: 8 * 60 },
      { id: 'B', durationSeconds: 12 * 60 },
      { id: 'C', durationSeconds: 25 * 60 },
      { id: 'D', durationSeconds: 5 * 60 },
      { id: 'E', durationSeconds: 7 * 60 },
      { id: 'F', durationSeconds: 4 * 60 },
    ];

    const result = buildSession(candidates, 20 * 60);
    expect(result.totalSeconds).toBe(20 * 60);
    expect(result.isPartial).toBe(false);
  });

  it('never exceeds the requested time by a large margin for a short session', () => {
    const candidates = [
      { id: 'short', durationSeconds: 4 * 60 },
      { id: 'long', durationSeconds: 40 * 60 },
    ];
    const result = buildSession(candidates, 5 * 60);
    expect(result.selectedIds).not.toContain('long');
  });

  it('flags a session as partial when there is not enough content', () => {
    const candidates = [{ id: 'A', durationSeconds: 2 * 60 }];
    const result = buildSession(candidates, 30 * 60);
    expect(result.isPartial).toBe(true);
    expect(result.totalSeconds).toBe(2 * 60);
  });
});

describe('buildSession — shorts-length combinations', () => {
  it('gets close to 5 minutes without exceeding it significantly', () => {
    const candidates = [
      { id: '1', durationSeconds: 45 },
      { id: '2', durationSeconds: 50 },
      { id: '3', durationSeconds: 40 },
      { id: '4', durationSeconds: 55 },
      { id: '5', durationSeconds: 45 },
      { id: '6', durationSeconds: 35 },
    ];
    const result = buildSession(candidates, 5 * 60);
    expect(result.totalSeconds).toBeLessThanOrEqual(5 * 60 * 1.2);
    expect(result.totalSeconds).toBeGreaterThanOrEqual(3 * 60);
  });
});

describe('buildSession — edge cases', () => {
  it('returns an empty, partial session for an empty candidate pool', () => {
    const result = buildSession([], 10 * 60);
    expect(result.selectedIds).toEqual([]);
    expect(result.isPartial).toBe(true);
  });

  it('returns an empty, partial session for a zero/invalid target', () => {
    const result = buildSession([{ id: 'A', durationSeconds: 60 }], 0);
    expect(result.selectedIds).toEqual([]);
  });
});
