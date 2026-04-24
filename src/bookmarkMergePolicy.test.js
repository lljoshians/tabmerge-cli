'use strict';

const {
  keepOldest,
  keepNewest,
  mergeFields,
  keepRichest,
  applyMergePolicy,
} = require('./bookmarkMergePolicy');

const bm = (url, title, addDate, tags = []) => ({ url, title, addDate, tags });

const A = bm('https://example.com', 'Example', 1000, ['a']);
const B = bm('https://example.com', 'Example Site', 2000, ['b', 'c']);
const C = bm('https://other.com', 'Other', 1500, ['x']);

describe('keepOldest', () => {
  test('returns bookmark with smallest addDate', () => {
    expect(keepOldest([A, B])).toBe(A);
  });

  test('handles single bookmark', () => {
    expect(keepOldest([B])).toBe(B);
  });
});

describe('keepNewest', () => {
  test('returns bookmark with largest addDate', () => {
    expect(keepNewest([A, B])).toBe(B);
  });

  test('handles missing addDate as 0', () => {
    const noDate = bm('https://example.com', 'No Date', undefined);
    expect(keepNewest([noDate, A])).toBe(A);
  });
});

describe('mergeFields', () => {
  test('unions tags from all duplicates', () => {
    const merged = mergeFields([A, B]);
    expect(merged.tags).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    expect(merged.tags).toHaveLength(3);
  });

  test('takes title from newest', () => {
    const merged = mergeFields([A, B]);
    expect(merged.title).toBe('Example Site');
  });
});

describe('keepRichest', () => {
  test('returns bookmark with longest title', () => {
    expect(keepRichest([A, B])).toBe(B);
  });
});

describe('applyMergePolicy', () => {
  const bookmarks = [A, B, C];

  test('deduplicates using newest policy', () => {
    const result = applyMergePolicy(bookmarks, 'newest');
    expect(result).toHaveLength(2);
    const ex = result.find(b => b.url === 'https://example.com');
    expect(ex.title).toBe('Example Site');
  });

  test('deduplicates using oldest policy', () => {
    const result = applyMergePolicy(bookmarks, 'oldest');
    const ex = result.find(b => b.url === 'https://example.com');
    expect(ex.addDate).toBe(1000);
  });

  test('deduplicates using merge policy', () => {
    const result = applyMergePolicy(bookmarks, 'merge');
    const ex = result.find(b => b.url === 'https://example.com');
    expect(ex.tags).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });

  test('defaults to newest when no policy specified', () => {
    const result = applyMergePolicy(bookmarks);
    expect(result).toHaveLength(2);
  });

  test('throws on unknown policy', () => {
    expect(() => applyMergePolicy(bookmarks, 'unknown')).toThrow(/Unknown merge policy/);
  });

  test('preserves unique bookmarks unchanged', () => {
    const result = applyMergePolicy([C], 'newest');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(C);
  });
});
