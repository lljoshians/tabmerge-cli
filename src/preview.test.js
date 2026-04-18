const { previewBookmarks, previewFolders } = require('./preview');

const bookmarks = [
  { title: 'Alpha', url: 'https://alpha.com', folder: 'A', addDate: 1700000000 },
  { title: 'Beta', url: 'https://beta.com', folder: 'B', addDate: 1700000001 },
  { title: 'Gamma', url: 'https://gamma.com', folder: 'A', addDate: 1700000002 },
];

describe('previewBookmarks', () => {
  test('shows all when under limit', () => {
    const out = previewBookmarks(bookmarks, { limit: 10 });
    expect(out).toContain('Alpha');
    expect(out).toContain('Beta');
    expect(out).toContain('Gamma');
    expect(out).toContain('Showing 3 of 3');
  });

  test('respects limit', () => {
    const out = previewBookmarks(bookmarks, { limit: 2 });
    expect(out).toContain('Showing 2 of 3');
    expect(out).not.toContain('Gamma');
  });

  test('handles missing title', () => {
    const b = [{ url: 'https://x.com', folder: null, addDate: null }];
    const out = previewBookmarks(b);
    expect(out).toContain('(no title)');
    expect(out).toContain('unknown');
  });

  test('default limit is 10', () => {
    const many = Array.from({ length: 15 }, (_, i) => ({
      title: `T${i}`, url: `https://t${i}.com`, folder: 'X', addDate: 1700000000 + i,
    }));
    const out = previewBookmarks(many);
    expect(out).toContain('Showing 10 of 15');
  });
});

describe('previewFolders', () => {
  test('counts bookmarks per folder', () => {
    const out = previewFolders(bookmarks);
    expect(out).toContain('A: 2');
    expect(out).toContain('B: 1');
  });

  test('handles missing folder', () => {
    const b = [{ title: 'X', url: 'https://x.com' }];
    const out = previewFolders(b);
    expect(out).toContain('(none): 1');
  });
});
