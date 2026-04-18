const { extractTags, tagBookmark, tagAll, filterByTags, tagFrequency } = require('./tagger');

describe('extractTags', () => {
  it('extracts inline tags from title', () => {
    const b = { title: 'My [work] resource [js]', folder: '' };
    expect(extractTags(b)).toEqual(expect.arrayContaining(['work', 'js']));
  });

  it('uses folder as a tag', () => {
    const b = { title: 'Something', folder: 'Dev Tools' };
    expect(extractTags(b)).toContain('dev-tools');
  });

  it('merges existing tags', () => {
    const b = { title: 'Hi', folder: '', tags: ['existing'] };
    expect(extractTags(b)).toContain('existing');
  });

  it('returns empty array for bare bookmark', () => {
    const b = { title: 'Plain', folder: '' };
    expect(Array.isArray(extractTags(b))).toBe(true);
  });
});

describe('tagBookmark', () => {
  it('returns a new object with tags array', () => {
    const b = { title: '[news] Article', url: 'https://example.com', folder: 'Reading' };
    const result = tagBookmark(b);
    expect(result).not.toBe(b);
    expect(result.tags).toContain('news');
    expect(result.tags).toContain('reading');
  });
});

describe('tagAll', () => {
  it('tags all bookmarks in array', () => {
    const bookmarks = [
      { title: '[work] Task', folder: '' },
      { title: 'Fun [personal]', folder: 'Hobbies' },
    ];
    const result = tagAll(bookmarks);
    expect(result[0].tags).toContain('work');
    expect(result[1].tags).toContain('personal');
    expect(result[1].tags).toContain('hobbies');
  });

  it('returns empty array for non-array input', () => {
    expect(tagAll(null)).toEqual([]);
  });
});

describe('filterByTags', () => {
  const bookmarks = [
    { title: 'A', tags: ['work', 'js'] },
    { title: 'B', tags: ['personal'] },
    { title: 'C', tags: ['work', 'css'] },
  ];

  it('filters by a single tag', () => {
    expect(filterByTags(bookmarks, ['work'])).toHaveLength(2);
  });

  it('filters by multiple tags (AND logic)', () => {
    expect(filterByTags(bookmarks, ['work', 'js'])).toHaveLength(1);
  });

  it('returns all when no tags given', () => {
    expect(filterByTags(bookmarks, [])).toHaveLength(3);
  });
});

describe('tagFrequency', () => {
  it('counts tag occurrences', () => {
    const bookmarks = [
      { tags: ['work', 'js'] },
      { tags: ['work'] },
      { tags: ['personal'] },
    ];
    const freq = tagFrequency(bookmarks);
    expect(freq['work']).toBe(2);
    expect(freq['js']).toBe(1);
    expect(freq['personal']).toBe(1);
  });
});
