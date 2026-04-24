const { formatClustersAsJson, formatClustersAsHtml, formatClustersAsText } = require('./clusterFormatter');

const sampleClusters = new Map([
  ['github.com', [
    { title: 'GitHub Tips', url: 'https://github.com/tips', tags: ['dev'], folder: 'Dev', addDate: 1700000000 },
    { title: 'GitHub Actions', url: 'https://github.com/actions', tags: [], folder: null, addDate: null },
  ]],
  ['recipes.com', [
    { title: 'Pasta Recipes', url: 'https://recipes.com/pasta', tags: ['food'], folder: 'Food', addDate: null },
  ]],
]);

describe('formatClustersAsJson', () => {
  test('returns an object with cluster labels as keys', () => {
    const result = formatClustersAsJson(sampleClusters);
    expect(result).toHaveProperty('github.com');
    expect(result).toHaveProperty('recipes.com');
  });

  test('each cluster is an array of bookmark objects', () => {
    const result = formatClustersAsJson(sampleClusters);
    expect(Array.isArray(result['github.com'])).toBe(true);
    expect(result['github.com'].length).toBe(2);
  });

  test('bookmark objects contain expected fields', () => {
    const result = formatClustersAsJson(sampleClusters);
    const bm = result['github.com'][0];
    expect(bm).toHaveProperty('title');
    expect(bm).toHaveProperty('url');
    expect(bm).toHaveProperty('tags');
    expect(bm).toHaveProperty('folder');
    expect(bm).toHaveProperty('addDate');
  });

  test('handles empty cluster map', () => {
    expect(formatClustersAsJson(new Map())).toEqual({});
  });
});

describe('formatClustersAsHtml', () => {
  test('returns a string starting with DOCTYPE', () => {
    const result = formatClustersAsHtml(sampleClusters);
    expect(typeof result).toBe('string');
    expect(result.startsWith('<!DOCTYPE html>')).toBe(true);
  });

  test('contains a section per cluster', () => {
    const result = formatClustersAsHtml(sampleClusters);
    expect(result.match(/<section/g).length).toBe(2);
  });

  test('escapes special chars in titles', () => {
    const clusters = new Map([['test', [{ title: '<script>', url: 'http://x.com' }]]]);
    const result = formatClustersAsHtml(clusters);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });
});

describe('formatClustersAsText', () => {
  test('returns a non-empty string', () => {
    const result = formatClustersAsText(sampleClusters);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('includes cluster label and bookmark count', () => {
    const result = formatClustersAsText(sampleClusters);
    expect(result).toContain('[github.com] (2 bookmarks)');
    expect(result).toContain('[recipes.com] (1 bookmark)');
  });

  test('lists bookmark titles', () => {
    const result = formatClustersAsText(sampleClusters);
    expect(result).toContain('GitHub Tips');
    expect(result).toContain('Pasta Recipes');
  });

  test('handles empty map gracefully', () => {
    expect(formatClustersAsText(new Map())).toBe('');
  });
});
