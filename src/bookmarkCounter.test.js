const {
  countTotal,
  countByFolder,
  countByDomain,
  topN,
  buildCountSummary,
} = require('./bookmarkCounter');

const sampleBookmarks = [
  { url: 'https://github.com/foo', title: 'Foo', folder: 'Dev' },
  { url: 'https://github.com/bar', title: 'Bar', folder: 'Dev' },
  { url: 'https://news.ycombinator.com', title: 'HN', folder: 'News' },
  { url: 'https://example.com', title: 'Example', folder: 'Dev' },
  { url: 'not-a-url', title: 'Bad', folder: 'Misc' },
];

describe('countTotal', () => {
  test('returns correct count for array', () => {
    expect(countTotal(sampleBookmarks)).toBe(5);
  });
  test('returns 0 for empty array', () => {
    expect(countTotal([])).toBe(0);
  });
  test('returns 0 for non-array', () => {
    expect(countTotal(null)).toBe(0);
  });
});

describe('countByFolder', () => {
  test('groups bookmarks by folder', () => {
    const result = countByFolder(sampleBookmarks);
    expect(result['Dev']).toBe(3);
    expect(result['News']).toBe(1);
    expect(result['Misc']).toBe(1);
  });
  test('uses Uncategorized for missing folder', () => {
    const bms = [{ url: 'https://a.com', title: 'A' }];
    expect(countByFolder(bms)['Uncategorized']).toBe(1);
  });
});

describe('countByDomain', () => {
  test('groups bookmarks by domain', () => {
    const result = countByDomain(sampleBookmarks);
    expect(result['github.com']).toBe(2);
    expect(result['news.ycombinator.com']).toBe(1);
    expect(result['invalid']).toBe(1);
  });
  test('returns empty object for empty array', () => {
    expect(countByDomain([])).toEqual({});
  });
});

describe('topN', () => {
  test('returns top N entries sorted descending', () => {
    const map = { a: 5, b: 10, c: 3, d: 8 };
    const result = topN(map, 2);
    expect(result[0]).toEqual({ key: 'b', count: 10 });
    expect(result[1]).toEqual({ key: 'd', count: 8 });
    expect(result.length).toBe(2);
  });
  test('returns all entries if n exceeds map size', () => {
    const map = { x: 1, y: 2 };
    expect(topN(map, 10).length).toBe(2);
  });
});

describe('buildCountSummary', () => {
  test('returns correct summary shape', () => {
    const summary = buildCountSummary(sampleBookmarks);
    expect(summary.total).toBe(5);
    expect(summary.uniqueFolders).toBe(3);
    expect(typeof summary.uniqueDomains).toBe('number');
    expect(Array.isArray(summary.topFolders)).toBe(true);
    expect(Array.isArray(summary.topDomains)).toBe(true);
  });
  test('top folders first entry is highest count folder', () => {
    const summary = buildCountSummary(sampleBookmarks);
    expect(summary.topFolders[0].key).toBe('Dev');
    expect(summary.topFolders[0].count).toBe(3);
  });
});
