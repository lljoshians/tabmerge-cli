const { groupByFolder, groupByDomain, groupByDate, applyGrouping } = require('./grouper');

const sampleBookmarks = [
  { title: 'GitHub', url: 'https://github.com/user/repo', folder: 'Dev', addDate: 1700000000 },
  { title: 'MDN', url: 'https://developer.mozilla.org/en-US/', folder: 'Dev', addDate: 1700086400 },
  { title: 'Google', url: 'https://www.google.com', folder: 'Search', addDate: 1700000000 },
  { title: 'No Folder', url: 'https://example.com', addDate: null },
];

describe('groupByFolder', () => {
  it('groups bookmarks by folder', () => {
    const result = groupByFolder(sampleBookmarks);
    expect(Object.keys(result)).toEqual(expect.arrayContaining(['Dev', 'Search', 'Uncategorized']));
    expect(result['Dev']).toHaveLength(2);
    expect(result['Search']).toHaveLength(1);
  });

  it('places bookmarks with no folder into Uncategorized', () => {
    const result = groupByFolder(sampleBookmarks);
    expect(result['Uncategorized']).toHaveLength(1);
    expect(result['Uncategorized'][0].title).toBe('No Folder');
  });
});

describe('groupByDomain', () => {
  it('groups bookmarks by domain stripping www', () => {
    const result = groupByDomain(sampleBookmarks);
    expect(result['github.com']).toHaveLength(1);
    expect(result['google.com']).toHaveLength(1);
  });

  it('handles invalid URLs gracefully', () => {
    const bad = [{ title: 'Bad', url: 'not-a-url' }];
    const result = groupByDomain(bad);
    expect(result['unknown']).toHaveLength(1);
  });
});

describe('groupByDate', () => {
  it('groups bookmarks by date string', () => {
    const result = groupByDate(sampleBookmarks);
    const keys = Object.keys(result);
    expect(keys).toContain('2023-11-14');
  });

  it('places bookmarks with no date under unknown', () => {
    const result = groupByDate(sampleBookmarks);
    expect(result['unknown']).toHaveLength(1);
  });
});

describe('applyGrouping', () => {
  it('defaults to folder grouping', () => {
    const result = applyGrouping(sampleBookmarks, 'folder');
    expect(result['Dev']).toHaveLength(2);
  });

  it('applies domain grouping', () => {
    const result = applyGrouping(sampleBookmarks, 'domain');
    expect(result['github.com']).toBeDefined();
  });

  it('applies date grouping', () => {
    const result = applyGrouping(sampleBookmarks, 'date');
    expect(result['unknown']).toBeDefined();
  });

  it('falls back to folder for unknown strategy', () => {
    const result = applyGrouping(sampleBookmarks, 'bogus');
    expect(result['Dev']).toHaveLength(2);
  });
});
