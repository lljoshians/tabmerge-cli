const {
  addLabel,
  removeLabel,
  labelWhere,
  getByLabel,
  labelFrequency,
} = require('./bookmarkLabeler');

const bk = (url, labels) => ({ url, title: url, labels });

describe('addLabel', () => {
  it('adds a label to a bookmark without one', () => {
    const result = addLabel({ url: 'https://a.com' }, 'work');
    expect(result.labels).toEqual(['work']);
  });

  it('does not duplicate an existing label', () => {
    const result = addLabel(bk('https://a.com', ['work']), 'work');
    expect(result.labels).toEqual(['work']);
  });

  it('appends a new label to existing ones', () => {
    const result = addLabel(bk('https://a.com', ['work']), 'read');
    expect(result.labels).toEqual(['work', 'read']);
  });

  it('does not mutate the original bookmark', () => {
    const orig = bk('https://a.com', ['work']);
    addLabel(orig, 'read');
    expect(orig.labels).toEqual(['work']);
  });
});

describe('removeLabel', () => {
  it('removes an existing label', () => {
    const result = removeLabel(bk('https://a.com', ['work', 'read']), 'work');
    expect(result.labels).toEqual(['read']);
  });

  it('is a no-op when label is absent', () => {
    const result = removeLabel(bk('https://a.com', ['read']), 'work');
    expect(result.labels).toEqual(['read']);
  });
});

describe('labelWhere', () => {
  it('labels only matching bookmarks', () => {
    const bks = [bk('https://a.com', []), bk('https://b.com', [])];
    const result = labelWhere(bks, (b) => b.url.includes('a.com'), 'fav');
    expect(result[0].labels).toContain('fav');
    expect(result[1].labels).not.toContain('fav');
  });
});

describe('getByLabel', () => {
  it('returns bookmarks with the given label', () => {
    const bks = [bk('https://a.com', ['work']), bk('https://b.com', ['read'])];
    expect(getByLabel(bks, 'work')).toHaveLength(1);
    expect(getByLabel(bks, 'work')[0].url).toBe('https://a.com');
  });

  it('returns empty array when none match', () => {
    expect(getByLabel([bk('https://a.com', ['work'])], 'none')).toEqual([]);
  });
});

describe('labelFrequency', () => {
  it('counts label occurrences across bookmarks', () => {
    const bks = [
      bk('https://a.com', ['work', 'read']),
      bk('https://b.com', ['work']),
      bk('https://c.com', []),
    ];
    const freq = labelFrequency(bks);
    expect(freq.work).toBe(2);
    expect(freq.read).toBe(1);
    expect(freq.other).toBeUndefined();
  });
});
