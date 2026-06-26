import { filterByMinPriority, topTasks } from './tasks';

describe('topTasks', () => {
  it('returns the highest priority tasks first', () => {
    const top = topTasks(2);
    expect(top).toHaveLength(2);
    expect(top[0].priority).toBe(5);
    expect(top[1].priority).toBe(5);
  });

  it('never returns more than the requested limit', () => {
    expect(topTasks(1)).toHaveLength(1);
  });
});

describe('filterByMinPriority', () => {
  // This test passes: tasks strictly above the threshold are clearly included.
  it('includes tasks above the threshold', () => {
    const result = filterByMinPriority(2);
    expect(result.every((t) => t.priority >= 2)).toBe(true);
    expect(result.some((t) => t.priority === 5)).toBe(true);
  });

  // This test FAILS on purpose — it documents the planted off-by-one bug.
  // "minimum priority" should be INCLUSIVE, so priority === min must be returned.
  it('includes tasks exactly equal to the threshold (currently failing)', () => {
    const result = filterByMinPriority(2);
    const hasExactMatch = result.some((t) => t.priority === 2);
    expect(hasExactMatch).toBe(true);
  });
});
