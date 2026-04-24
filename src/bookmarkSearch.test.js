const {
  normalize,
  matchesQuery,
  scoreBookmark,
  searchBookmarks,
  searchTop,
} = require('./bookmarkSearch');

const bookmarks = [
  { title: 'GitHub', url: 'https://github.com', folder: 'Dev' },
  { title: 'Google Search', url: 'https://google.com', folder: 'Search' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', folder: 'Dev' },
  { title: 'YouTube', url: 'https://youtube.com', folder: 'Media' },
  { title: 'Dev.to', url: 'https://dev.to', folder: 'Dev' },
];

describe('normalize', () => {
  it('lowercases and trims a string', () => {
    expect(normalize('  Hello World  ')).toBe('hello world');
  });
  it('handles null/undefined gracefully', () => {
    expect(normalize(null)).toBe('');
    expect(normalize(undefined)).toBe('');
  });
});

describe('matchesQuery', () => {
  it('returns true when title matches', () => {
    expect(matchesQuery({ title: 'GitHub', url: '', folder: '' }, 'git')).toBe(true);
  });
  it('returns true when url matches', () => {
    expect(matchesQuery({ title: '', url: 'https://github.com', folder: '' }, 'github')).toBe(true);
  });
  it('returns true when folder matches', () => {
    expect(matchesQuery({ title: '', url: '', folder: 'Dev' }, 'dev')).toBe(true);
  });
  it('returns false when nothing matches', () => {
    expect(matchesQuery({ title: 'YouTube', url: 'https://youtube.com', folder: 'Media' }, 'github')).toBe(false);
  });
  it('returns true for empty query', () => {
    expect(matchesQuery({ title: 'X', url: 'y', folder: 'z' }, '')).toBe(true);
  });
});

describe('scoreBookmark', () => {
  it('scores title match highest', () => {
    const b = { title: 'GitHub', url: 'https://github.com', folder: 'Dev' };
    expect(scoreBookmark(b, 'github')).toBe(5); // title(3) + url(2)
  });
  it('scores only folder match as 1', () => {
    const b = { title: 'Something', url: 'https://example.com', folder: 'Dev' };
    expect(scoreBookmark(b, 'dev')).toBe(1);
  });
  it('returns 0 for empty query', () => {
    expect(scoreBookmark({ title: 'X', url: 'y', folder: 'z' }, '')).toBe(0);
  });
});

describe('searchBookmarks', () => {
  it('returns all bookmarks for empty query', () => {
    expect(searchBookmarks(bookmarks, '').length).toBe(5);
  });
  it('filters by title', () => {
    const results = searchBookmarks(bookmarks, 'github');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('GitHub');
  });
  it('filters by folder', () => {
    const results = searchBookmarks(bookmarks, 'dev');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });
  it('sorts by relevance score descending', () => {
    const results = searchBookmarks(bookmarks, 'dev');
    // Dev.to matches title+url+folder, others match only folder
    expect(results[0].title).toBe('Dev.to');
  });
});

describe('searchTop', () => {
  it('limits results to N', () => {
    const results = searchTop(bookmarks, 'dev', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });
  it('defaults to 10 results', () => {
    const big = Array.from({ length: 20 }, (_, i) => ({
      title: `Dev Site ${i}`,
      url: `https://dev${i}.com`,
      folder: 'Dev',
    }));
    expect(searchTop(big, 'dev').length).toBe(10);
  });
});
