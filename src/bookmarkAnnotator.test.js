const {
  annotateBookmark,
  removeAnnotation,
  annotateWhere,
  getAnnotated,
  buildAnnotationMap,
} = require('./bookmarkAnnotator');

const sampleBookmarks = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub', annotation: 'code host' },
  { url: 'https://news.ycombinator.com', title: 'HN' },
];

describe('annotateBookmark', () => {
  it('adds annotation to a bookmark', () => {
    const result = annotateBookmark({ url: 'https://example.com', title: 'Ex' }, 'my note');
    expect(result.annotation).toBe('my note');
  });

  it('trims whitespace from note', () => {
    const result = annotateBookmark({ url: 'https://a.com' }, '  trimmed  ');
    expect(result.annotation).toBe('trimmed');
  });

  it('overwrites existing annotation', () => {
    const bm = { url: 'https://a.com', annotation: 'old' };
    expect(annotateBookmark(bm, 'new').annotation).toBe('new');
  });

  it('throws on invalid bookmark', () => {
    expect(() => annotateBookmark(null, 'note')).toThrow('Invalid bookmark');
  });

  it('throws when note is not a string', () => {
    expect(() => annotateBookmark({ url: 'x' }, 42)).toThrow('Note must be a string');
  });
});

describe('removeAnnotation', () => {
  it('removes annotation field', () => {
    const bm = { url: 'https://a.com', annotation: 'hi' };
    const result = removeAnnotation(bm);
    expect(result.annotation).toBeUndefined();
    expect(result.url).toBe('https://a.com');
  });

  it('is a no-op if no annotation exists', () => {
    const bm = { url: 'https://a.com' };
    expect(removeAnnotation(bm)).toEqual({ url: 'https://a.com' });
  });

  it('throws on invalid input', () => {
    expect(() => removeAnnotation(undefined)).toThrow();
  });
});

describe('annotateWhere', () => {
  it('annotates matching bookmarks', () => {
    const result = annotateWhere(sampleBookmarks, b => b.title === 'Example', 'home');
    expect(result[0].annotation).toBe('home');
    expect(result[1].annotation).toBe('code host');
  });

  it('returns empty array for non-array input', () => {
    expect(annotateWhere(null, () => true, 'x')).toEqual([]);
  });
});

describe('getAnnotated', () => {
  it('returns only annotated bookmarks', () => {
    const result = getAnnotated(sampleBookmarks);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub');
  });

  it('returns empty array for non-array input', () => {
    expect(getAnnotated(null)).toEqual([]);
  });
});

describe('buildAnnotationMap', () => {
  it('builds url->annotation map', () => {
    const map = buildAnnotationMap(sampleBookmarks);
    expect(map['https://github.com']).toBe('code host');
    expect(map['https://example.com']).toBeUndefined();
  });

  it('returns empty object for non-array input', () => {
    expect(buildAnnotationMap(null)).toEqual({});
  });
});
