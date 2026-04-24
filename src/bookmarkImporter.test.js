const fs = require('fs');
const path = require('path');
const { resolveInputPaths, importBookmarks, importFromPatterns } = require('./bookmarkImporter');
const { parseBookmarkFile } = require('./parser');

jest.mock('./parser');
jest.mock('fs');

describe('resolveInputPaths', () => {
  it('returns non-glob paths as-is', () => {
    const result = resolveInputPaths(['/some/file.html']);
    expect(result).toEqual(['/some/file.html']);
  });

  it('expands glob patterns using readdirSync', () => {
    fs.readdirSync.mockReturnValue(['a.html', 'b.html', 'notes.txt']);
    const result = resolveInputPaths(['/dir/*.html']);
    expect(fs.readdirSync).toHaveBeenCalledWith('/dir');
    expect(result).toEqual(['/dir/a.html', '/dir/b.html']);
  });

  it('returns empty array if no files match glob', () => {
    fs.readdirSync.mockReturnValue(['notes.txt']);
    const result = resolveInputPaths(['/dir/*.html']);
    expect(result).toEqual([]);
  });
});

describe('importBookmarks', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    parseBookmarkFile.mockImplementation(filePath => [
      { title: 'A', url: 'https://a.com', folder: 'Root' },
      { title: 'B', url: 'https://b.com', folder: 'Root' }
    ]);
  });

  it('returns combined bookmarks and sources', () => {
    const result = importBookmarks(['/f1.html', '/f2.html']);
    expect(result.bookmarks).toHaveLength(4);
    expect(result.sources).toHaveLength(2);
    expect(result.sources[0]).toEqual({ file: '/f1.html', count: 2 });
  });

  it('throws if file does not exist', () => {
    fs.existsSync.mockReturnValue(false);
    expect(() => importBookmarks(['/missing.html'])).toThrow('File not found');
  });
});

describe('importFromPatterns', () => {
  it('throws if no files matched', () => {
    fs.readdirSync.mockReturnValue([]);
    expect(() => importFromPatterns(['/dir/*.html'])).toThrow('No input files matched');
  });

  it('delegates to importBookmarks after resolving', () => {
    fs.readdirSync.mockReturnValue(['x.html']);
    fs.existsSync.mockReturnValue(true);
    parseBookmarkFile.mockReturnValue([{ title: 'X', url: 'https://x.com' }]);
    const result = importFromPatterns(['/dir/*.html']);
    expect(result.bookmarks).toHaveLength(1);
  });
});
