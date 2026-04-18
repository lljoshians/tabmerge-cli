const { filterByKeyword, filterByFolder, filterBySince, applyFilters } = require('./filter');

const bookmarks = [
  { title: 'GitHub', url: 'https://github.com', folder: 'Dev', addDate: 1700000000000 },
  { title: 'Google', url: 'https://google.com', folder: 'Search', addDate: 1600000000000 },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', folder: 'Dev', addDate: 1710000000000 },
  { title: 'Reddit', url: 'https://reddit.com', folder: 'Social', addDate: 1500000000000 },
];

describe('filterByKeyword', () => {
  test('filters by title keyword', () => {
    const result = filterByKeyword(bookmarks, 'github');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub');
  });

  test('filters by url keyword', () => {
    const result = filterByKeyword(bookmarks, 'mozilla');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('MDN Web Docs');
  });

  test('returns all if no keyword', () => {
    expect(filterByKeyword(bookmarks, '')).toHaveLength(4);
  });
});

describe('filterByFolder', () => {
  test('filters by exact folder name (case-insensitive)', () => {
    const result = filterByFolder(bookmarks, 'dev');
    expect(result).toHaveLength(2);
  });

  test('returns empty array for unknown folder', () => {
    expect(filterByFolder(bookmarks, 'News')).toHaveLength(0);
  });

  test('returns all if no folder', () => {
    expect(filterByFolder(bookmarks, '')).toHaveLength(4);
  });
});

describe('filterBySince', () => {
  test('filters bookmarks after given date', () => {
    const result = filterBySince(bookmarks, new Date(1650000000000));
    expect(result).toHaveLength(2);
  });

  test('returns all if no since', () => {
    expect(filterBySince(bookmarks, null)).toHaveLength(4);
  });
});

describe('applyFilters', () => {
  test('applies multiple filters together', () => {
    const result = applyFilters(bookmarks, { folder: 'Dev', keyword: 'github' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub');
  });

  test('returns all with empty opts', () => {
    expect(applyFilters(bookmarks, {})).toHaveLength(4);
  });
});
