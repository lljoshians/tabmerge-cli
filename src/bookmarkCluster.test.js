const { clusterBookmarks, flattenClusters, domainKey, jaccard, termSet } = require('./bookmarkCluster');

const sampleBookmarks = [
  { title: 'GitHub JavaScript tips', url: 'https://github.com/js-tips', tags: ['javascript', 'github'] },
  { title: 'GitHub Actions guide', url: 'https://github.com/actions-guide', tags: ['github', 'devops'] },
  { title: 'MDN JavaScript reference', url: 'https://developer.mozilla.org/js', tags: ['javascript', 'docs'] },
  { title: 'Cooking pasta recipes', url: 'https://recipes.com/pasta', tags: ['food', 'cooking'] },
  { title: 'Best pasta dishes', url: 'https://recipes.com/best-pasta', tags: ['food', 'pasta'] },
];

describe('domainKey', () => {
  test('strips www prefix', () => {
    expect(domainKey('https://www.github.com/foo')).toBe('github.com');
  });
  test('returns unknown for invalid url', () => {
    expect(domainKey('not-a-url')).toBe('unknown');
  });
});

describe('jaccard', () => {
  test('identical sets return 1', () => {
    const a = new Set(['a', 'b']);
    expect(jaccard(a, a)).toBe(1);
  });
  test('disjoint sets return 0', () => {
    expect(jaccard(new Set(['a']), new Set(['b']))).toBe(0);
  });
  test('partial overlap', () => {
    const a = new Set(['a', 'b']);
    const b = new Set(['b', 'c']);
    expect(jaccard(a, b)).toBeCloseTo(1 / 3);
  });
  test('two empty sets return 0', () => {
    expect(jaccard(new Set(), new Set())).toBe(0);
  });
});

describe('termSet', () => {
  test('extracts words longer than 3 chars from title', () => {
    const bm = { title: 'Hello World Test', tags: [] };
    const ts = termSet(bm);
    expect(ts.has('hello')).toBe(true);
    expect(ts.has('world')).toBe(true);
    expect(ts.has('test')).toBe(true);
  });
  test('includes tags', () => {
    const bm = { title: '', tags: ['javascript'] };
    expect(termSet(bm).has('javascript')).toBe(true);
  });
});

describe('clusterBookmarks', () => {
  test('returns a Map', () => {
    const result = clusterBookmarks(sampleBookmarks);
    expect(result).toBeInstanceOf(Map);
  });

  test('same-domain bookmarks grouped together by default', () => {
    const result = clusterBookmarks(sampleBookmarks, { groupByDomain: true });
    const githubCluster = result.get('github.com');
    expect(githubCluster).toBeDefined();
    expect(githubCluster.length).toBe(2);
  });

  test('handles empty array', () => {
    const result = clusterBookmarks([]);
    expect(result.size).toBe(0);
  });

  test('single bookmark forms its own cluster', () => {
    const result = clusterBookmarks([sampleBookmarks[0]]);
    expect(result.size).toBe(1);
  });
});

describe('flattenClusters', () => {
  test('adds cluster property to each bookmark', () => {
    const clusters = clusterBookmarks(sampleBookmarks);
    const flat = flattenClusters(clusters);
    expect(flat.length).toBe(sampleBookmarks.length);
    flat.forEach(bm => expect(bm.cluster).toBeDefined());
  });

  test('preserves original bookmark fields', () => {
    const clusters = clusterBookmarks([sampleBookmarks[0]]);
    const flat = flattenClusters(clusters);
    expect(flat[0].title).toBe(sampleBookmarks[0].title);
  });
});
