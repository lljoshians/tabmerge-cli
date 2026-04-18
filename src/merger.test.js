const { mergeBookmarks } = require('./merger');

const setA = [
  { url: 'https://example.com', title: 'Example', folder: 'Work' },
  { url: 'https://github.com', title: 'GitHub', folder: 'Dev' },
];

const setB = [
  { url: 'https://example.com', title: 'Example Site', folder: 'Personal' },
  { url: 'https://mozilla.org', title: 'Mozilla', folder: 'Dev' },
];

describe('mergeBookmarks', () => {
  test('merges two sets into one', () => {
    const result = mergeBookmarks([setA, setB]);
    expect(result.length).toBe(3);
  });

  test('deduplicates by URL', () => {
    const result = mergeBookmarks([setA, setB]);
    const urls = result.map((b) => b.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  test('preserves folders from all sources when preserveFolders is true', () => {
    const result = mergeBookmarks([setA, setB], { preserveFolders: true });
    const example = result.find((b) => b.url === 'https://example.com');
    expect(example.folders).toEqual(expect.arrayContaining(['Work', 'Personal']));
  });

  test('does not add folders array when URL appears only once', () => {
    const result = mergeBookmarks([setA, setB], { preserveFolders: true });
    const github = result.find((b) => b.url === 'https://github.com');
    expect(github.folders).toBeUndefined();
  });

  test('skips deduplication when deduplicate is false', () => {
    const result = mergeBookmarks([setA, setB], { deduplicate: false });
    expect(result.length).toBe(4);
  });

  test('returns empty array for empty input', () => {
    expect(mergeBookmarks([])).toEqual([]);
  });

  test('throws if a set is not an array', () => {
    expect(() => mergeBookmarks([setA, null])).toThrow(TypeError);
  });

  test('handles a single bookmark set', () => {
    const result = mergeBookmarks([setA]);
    expect(result.length).toBe(setA.length);
  });
});
