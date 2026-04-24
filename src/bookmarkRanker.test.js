const {
  recencyScore,
  titleScore,
  domainPopularityScore,
  buildDomainCounts,
  rankBookmarks,
} = require('./bookmarkRanker');

const NOW = 1700000000000;
const RECENT = Math.floor((NOW - 1000 * 60 * 60 * 24 * 30) / 1000); // 30 days ago
const OLD = Math.floor((NOW - 1000 * 60 * 60 * 24 * 365 * 6) / 1000); // 6 years ago

describe('recencyScore', () => {
  it('returns high score for recent bookmark', () => {
    const score = recencyScore({ addDate: RECENT }, NOW);
    expect(score).toBeGreaterThan(0.9);
  });

  it('returns 0 for very old bookmark', () => {
    const score = recencyScore({ addDate: OLD }, NOW);
    expect(score).toBe(0);
  });

  it('returns 0 when addDate is missing', () => {
    expect(recencyScore({}, NOW)).toBe(0);
  });
});

describe('titleScore', () => {
  it('returns 1 for a good-length title', () => {
    expect(titleScore({ title: 'A nice bookmark title' })).toBe(1);
  });

  it('penalises very short titles', () => {
    expect(titleScore({ title: 'Hi' })).toBeLessThan(1);
  });

  it('penalises very long titles', () => {
    const long = 'x'.repeat(250);
    expect(titleScore({ title: long })).toBeLessThan(0.5);
  });

  it('returns 0 for empty title', () => {
    expect(titleScore({ title: '' })).toBe(0);
  });
});

describe('buildDomainCounts', () => {
  it('counts domains correctly', () => {
    const bookmarks = [
      { url: 'https://example.com/a' },
      { url: 'https://example.com/b' },
      { url: 'https://other.org/c' },
    ];
    const counts = buildDomainCounts(bookmarks);
    expect(counts.get('example.com')).toBe(2);
    expect(counts.get('other.org')).toBe(1);
  });

  it('ignores invalid URLs', () => {
    const counts = buildDomainCounts([{ url: 'not-a-url' }]);
    expect(counts.size).toBe(0);
  });
});

describe('rankBookmarks', () => {
  const bookmarks = [
    { title: 'Old boring page', url: 'https://rare.io/page', addDate: OLD },
    { title: 'Recent popular article', url: 'https://popular.com/1', addDate: RECENT },
    { title: 'Another popular post', url: 'https://popular.com/2', addDate: RECENT },
  ];

  it('returns ranked array with scores', () => {
    const ranked = rankBookmarks(bookmarks);
    expect(ranked).toHaveLength(3);
    expect(ranked[0]).toHaveProperty('score');
    expect(ranked[0]).toHaveProperty('bookmark');
  });

  it('places recent bookmarks higher than old ones', () => {
    const ranked = rankBookmarks(bookmarks);
    const oldIndex = ranked.findIndex((r) => r.bookmark.addDate === OLD);
    expect(oldIndex).toBe(ranked.length - 1);
  });

  it('respects custom weights', () => {
    const ranked = rankBookmarks(bookmarks, { recency: 1, title: 0, domain: 0 });
    expect(ranked[0].bookmark.addDate).toBe(RECENT);
  });
});
