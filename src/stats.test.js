const { computeStats, formatStats } = require('./stats');

const sampleBookmarks = [
  { url: 'https://github.com/foo', title: 'Foo', folder: 'Dev' },
  { url: 'https://github.com/bar', title: 'Bar', folder: 'Dev' },
  { url: 'https://news.ycombinator.com', title: 'HN', folder: 'News' },
  { url: 'https://github.com/foo', title: 'Foo Dup', folder: 'Dev' },
  { url: 'https://example.com', title: 'Example', folder: null },
];

describe('computeStats', () => {
  let stats;
  beforeEach(() => {
    stats = computeStats(sampleBookmarks);
  });

  test('counts total bookmarks', () => {
    expect(stats.total).toBe(5);
  });

  test('counts unique bookmarks', () => {
    expect(stats.unique).toBe(4);
  });

  test('detects duplicates', () => {
    expect(stats.duplicates.count).toBe(1);
    expect(stats.duplicates.urls).toContain('https://github.com/foo');
  });

  test('collects folders (excluding null)', () => {
    expect(stats.folders).toContain('Dev');
    expect(stats.folders).toContain('News');
    expect(stats.folderCount).toBe(2);
  });

  test('returns top domains', () => {
    const githubEntry = stats.topDomains.find((d) => d.domain === 'github.com');
    expect(githubEntry).toBeDefined();
    expect(githubEntry.count).toBe(3);
  });

  test('handles empty array', () => {
    const empty = computeStats([]);
    expect(empty.total).toBe(0);
    expect(empty.unique).toBe(0);
    expect(empty.topDomains).toHaveLength(0);
  });
});

describe('formatStats', () => {
  test('returns a non-empty string', () => {
    const stats = computeStats(sampleBookmarks);
    const output = formatStats(stats);
    expect(typeof output).toBe('string');
    expect(output).toMatch(/Total bookmarks/);
    expect(output).toMatch(/github\.com/);
  });
});
