'use strict';

const {
  tokenize,
  buildWordFrequency,
  topWords,
  generateWordCloud,
} = require('./bookmarkWordCloud');

const sampleBookmarks = [
  { title: 'JavaScript Tips and Tricks for Developers', url: 'https://example.com/1' },
  { title: 'Advanced JavaScript Patterns', url: 'https://example.com/2' },
  { title: 'JavaScript Performance Guide', url: 'https://example.com/3' },
  { title: 'Node.js Best Practices', url: 'https://example.com/4' },
  { title: 'Node.js Performance Tips', url: 'https://example.com/5' },
  { title: '', url: 'https://example.com/6' },
];

describe('tokenize', () => {
  test('splits and lowercases words', () => {
    expect(tokenize('Hello World')).toEqual(['hello', 'world']);
  });

  test('removes stop words', () => {
    const result = tokenize('The quick brown fox');
    expect(result).not.toContain('the');
    expect(result).toContain('quick');
  });

  test('strips punctuation', () => {
    const result = tokenize('Node.js, best-practices!');
    expect(result.some(w => w.includes('.'))).toBe(false);
  });

  test('returns empty array for empty input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize(null)).toEqual([]);
  });

  test('filters words shorter than 3 characters', () => {
    expect(tokenize('go do it')).toEqual([]);
  });
});

describe('buildWordFrequency', () => {
  test('counts word occurrences across bookmarks', () => {
    const freq = buildWordFrequency(sampleBookmarks);
    expect(freq.get('javascript')).toBe(3);
    expect(freq.get('node')).toBe(2);
    expect(freq.get('performance')).toBe(2);
  });

  test('returns empty map for empty input', () => {
    expect(buildWordFrequency([]).size).toBe(0);
  });
});

describe('topWords', () => {
  test('returns words sorted by frequency', () => {
    const freq = buildWordFrequency(sampleBookmarks);
    const top = topWords(freq, 3);
    expect(top[0].word).toBe('javascript');
    expect(top[0].count).toBe(3);
    expect(top.length).toBe(3);
  });

  test('respects n limit', () => {
    const freq = new Map([['a', 5], ['b', 3], ['c', 1]]);
    expect(topWords(freq, 2).length).toBe(2);
  });
});

describe('generateWordCloud', () => {
  test('returns weight between 0 and 1', () => {
    const cloud = generateWordCloud(sampleBookmarks);
    for (const entry of cloud) {
      expect(entry.weight).toBeGreaterThanOrEqual(0);
      expect(entry.weight).toBeLessThanOrEqual(1);
    }
  });

  test('top word has weight 1', () => {
    const cloud = generateWordCloud(sampleBookmarks);
    expect(cloud[0].weight).toBe(1);
  });

  test('returns empty array for empty bookmarks', () => {
    expect(generateWordCloud([])).toEqual([]);
  });

  test('respects topN option', () => {
    const cloud = generateWordCloud(sampleBookmarks, { topN: 2 });
    expect(cloud.length).toBeLessThanOrEqual(2);
  });
});
