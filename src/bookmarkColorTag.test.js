const {
  VALID_COLORS,
  setColor,
  clearColor,
  colorWhere,
  getByColor,
  colorFrequency
} = require('./bookmarkColorTag');

const sample = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub', color: 'blue' },
  { url: 'https://news.ycombinator.com', title: 'HN', color: 'red' },
  { url: 'https://nodejs.org', title: 'Node.js' },
];

test('VALID_COLORS contains expected values', () => {
  expect(VALID_COLORS).toContain('red');
  expect(VALID_COLORS).toContain('blue');
  expect(VALID_COLORS.length).toBeGreaterThan(0);
});

test('setColor assigns a valid color', () => {
  const b = setColor(sample[0], 'green');
  expect(b.color).toBe('green');
  expect(b.url).toBe(sample[0].url);
});

test('setColor does not mutate original', () => {
  const orig = { url: 'https://a.com', title: 'A' };
  setColor(orig, 'red');
  expect(orig.color).toBeUndefined();
});

test('setColor throws on invalid color', () => {
  expect(() => setColor(sample[0], 'pink')).toThrow('Invalid color');
});

test('clearColor removes color field', () => {
  const b = clearColor(sample[1]);
  expect(b.color).toBeUndefined();
  expect(b.url).toBe(sample[1].url);
});

test('clearColor is safe on bookmark without color', () => {
  const b = clearColor(sample[0]);
  expect(b.color).toBeUndefined();
});

test('colorWhere applies color to matching bookmarks', () => {
  const result = colorWhere(sample, b => b.url.includes('github'), 'purple');
  const gh = result.find(b => b.url.includes('github'));
  expect(gh.color).toBe('purple');
  expect(result.find(b => b.url.includes('example')).color).toBeUndefined();
});

test('getByColor returns only matching bookmarks', () => {
  const blues = getByColor(sample, 'blue');
  expect(blues).toHaveLength(1);
  expect(blues[0].title).toBe('GitHub');
});

test('getByColor returns empty array if no matches', () => {
  expect(getByColor(sample, 'yellow')).toEqual([]);
});

test('colorFrequency counts color usage', () => {
  const freq = colorFrequency(sample);
  expect(freq.blue).toBe(1);
  expect(freq.red).toBe(1);
  expect(freq.green).toBeUndefined();
});

test('colorFrequency returns empty object for uncolored list', () => {
  const freq = colorFrequency([{ url: 'https://x.com', title: 'X' }]);
  expect(freq).toEqual({});
});
