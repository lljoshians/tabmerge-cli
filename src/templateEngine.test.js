const { renderTemplate, renderBookmarks, renderFolderHeader, DEFAULT_TEMPLATES } = require('./templateEngine');

describe('renderTemplate', () => {
  test('replaces known placeholders', () => {
    expect(renderTemplate('Hello {name}!', { name: 'World' })).toBe('Hello World!');
  });

  test('leaves unknown placeholders intact', () => {
    expect(renderTemplate('{title} - {url}', { title: 'Test' })).toBe('Test - {url}');
  });

  test('handles numeric values', () => {
    expect(renderTemplate('Count: {count}', { count: 42 })).toBe('Count: 42');
  });

  test('throws on non-string template', () => {
    expect(() => renderTemplate(null, {})).toThrow(TypeError);
  });

  test('handles empty data object', () => {
    expect(renderTemplate('no placeholders', {})).toBe('no placeholders');
  });
});

describe('renderBookmarks', () => {
  const bookmarks = [
    { title: 'Google', url: 'https://google.com', folder: 'Search' },
    { title: 'GitHub', url: 'https://github.com', folder: 'Dev' },
    { title: 'No Folder', url: 'https://example.com' }
  ];

  test('renders all bookmarks', () => {
    const result = renderBookmarks(bookmarks);
    expect(result).toContain('Google');
    expect(result).toContain('GitHub');
    expect(result).toContain('No Folder');
  });

  test('includes summary line', () => {
    const result = renderBookmarks(bookmarks);
    expect(result).toContain('Total: 3');
  });

  test('uses Uncategorized for missing folder', () => {
    const result = renderBookmarks(bookmarks);
    expect(result).toContain('Uncategorized');
  });

  test('respects custom item template', () => {
    const result = renderBookmarks(bookmarks, { item: '{title} => {url}' });
    expect(result).toContain('Google => https://google.com');
  });

  test('handles empty array', () => {
    const result = renderBookmarks([]);
    expect(result).toContain('Total: 0');
  });
});

describe('renderFolderHeader', () => {
  test('renders default folder header', () => {
    const result = renderFolderHeader('Dev', 5);
    expect(result).toBe('### Dev (5 bookmarks)');
  });

  test('renders with custom template', () => {
    const result = renderFolderHeader('News', 3, '== {folder} [{count}] ==');
    expect(result).toBe('== News [3] ==');
  });
});
