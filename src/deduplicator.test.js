const { deduplicateBookmarks, normalizeUrl } = require('./deduplicator');

describe('deduplicateBookmarks', () => {
  it('returns empty array for empty input', () => {
    const { bookmarks, duplicatesRemoved } = deduplicateBookmarks([]);
    expect(bookmarks).toEqual([]);
    expect(duplicatesRemoved).toBe(0);
  });

  it('throws if input is not an array', () => {
    expect(() => deduplicateBookmarks(null)).toThrow(TypeError);
    expect(() => deduplicateBookmarks('string')).toThrow(TypeError);
  });

  it('keeps unique bookmarks intact', () => {
    const input = [
      { url: 'https://example.com', title: 'Example' },
      { url: 'https://github.com', title: 'GitHub' },
    ];
    const { bookmarks, duplicatesRemoved } = deduplicateBookmarks(input);
    expect(bookmarks).toHaveLength(2);
    expect(duplicatesRemoved).toBe(0);
  });

  it('removes duplicate URLs', () => {
    const input = [
      { url: 'https://example.com', title: 'Example' },
      { url: 'https://example.com', title: 'Example duplicate' },
      { url: 'https://github.com', title: 'GitHub' },
    ];
    const { bookmarks, duplicatesRemoved } = deduplicateBookmarks(input);
    expect(bookmarks).toHaveLength(2);
    expect(duplicatesRemoved).toBe(1);
    expect(bookmarks[0].title).toBe('Example');
  });

  it('treats URLs with trailing slashes as duplicates', () => {
    const input = [
      { url: 'https://example.com/page', title: 'Page' },
      { url: 'https://example.com/page/', title: 'Page with slash' },
    ];
    const { bookmarks, duplicatesRemoved } = deduplicateBookmarks(input);
    expect(bookmarks).toHaveLength(1);
    expect(duplicatesRemoved).toBe(1);
  });

  it('keeps entries without a URL', () => {
    const input = [
      { title: 'Folder', url: null },
      { url: 'https://example.com', title: 'Example' },
    ];
    const { bookmarks } = deduplicateBookmarks(input);
    expect(bookmarks).toHaveLength(2);
  });
});

describe('normalizeUrl', () => {
  it('strips trailing slash from path', () => {
    expect(normalizeUrl('https://example.com/path/')).toBe('https://example.com/path');
  });

  it('preserves query string and hash', () => {
    const url = 'https://example.com/page?q=1#section';
    expect(normalizeUrl(url)).toContain('?q=1');
    expect(normalizeUrl(url)).toContain('#section');
  });

  it('falls back gracefully for invalid URLs', () => {
    expect(normalizeUrl('not a url')).toBe('not a url');
  });
});
