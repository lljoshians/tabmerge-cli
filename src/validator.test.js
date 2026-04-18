const { validateBookmark, validateAll, isValidUrl } = require('./validator');

describe('isValidUrl', () => {
  test('accepts http urls', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('accepts https urls', () => {
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true);
  });

  test('rejects javascript: urls', () => {
    expect(isValidUrl('javascript:void(0)')).toBe(false);
  });

  test('rejects malformed urls', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('validateBookmark', () => {
  const valid = { url: 'https://example.com', title: 'Example', addDate: 1700000000, folder: 'Work' };

  test('returns no errors for valid bookmark', () => {
    expect(validateBookmark(valid)).toEqual([]);
  });

  test('errors on missing url', () => {
    const errs = validateBookmark({ title: 'No URL' });
    expect(errs).toContain('Missing or invalid field: url');
  });

  test('errors on missing title', () => {
    const errs = validateBookmark({ url: 'https://example.com' });
    expect(errs).toContain('Missing or invalid field: title');
  });

  test('errors on invalid url scheme', () => {
    const errs = validateBookmark({ url: 'javascript:void(0)', title: 'Bad' });
    expect(errs[0]).toMatch(/Invalid URL scheme/);
  });

  test('errors on non-number addDate', () => {
    const errs = validateBookmark({ ...valid, addDate: '2024-01-01' });
    expect(errs).toContain('Field addDate must be a number');
  });

  test('errors when not an object', () => {
    expect(validateBookmark(null)).toEqual(['Bookmark must be an object']);
  });
});

describe('validateAll', () => {
  test('returns valid true for all valid bookmarks', () => {
    const bookmarks = [
      { url: 'https://a.com', title: 'A' },
      { url: 'https://b.com', title: 'B' },
    ];
    const result = validateAll(bookmarks);
    expect(result.valid).toBe(true);
    expect(result.invalidCount).toBe(0);
  });

  test('counts invalid bookmarks', () => {
    const bookmarks = [
      { url: 'https://a.com', title: 'A' },
      { title: 'No URL' },
    ];
    const result = validateAll(bookmarks);
    expect(result.valid).toBe(false);
    expect(result.invalidCount).toBe(1);
  });

  test('returns error when input is not array', () => {
    const result = validateAll('not array');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Input must be an array');
  });
});
