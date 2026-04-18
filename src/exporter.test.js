const fs = require('fs');
const path = require('path');
const os = require('os');
const { exportToFile, exportToStdout, resolveOutputPath } = require('./exporter');

const sampleBookmarks = [
  { title: 'Google', url: 'https://google.com', folder: 'Search', addDate: 1700000000 },
  { title: 'GitHub', url: 'https://github.com', folder: 'Dev', addDate: 1700000001 },
];

describe('exportToFile', () => {
  let tmpDir;
  beforeEach(() => { tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabmerge-')); });
  afterEach(() => { fs.rmSync(tmpDir, { recursive: true }); });

  test('writes json file', () => {
    const out = path.join(tmpDir, 'out.json');
    const result = exportToFile(sampleBookmarks, out);
    expect(result.format).toBe('json');
    expect(result.count).toBe(2);
    const data = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(data).toHaveLength(2);
  });

  test('writes html file', () => {
    const out = path.join(tmpDir, 'out.html');
    const result = exportToFile(sampleBookmarks, out);
    expect(result.format).toBe('html');
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toContain('<!DOCTYPE NETSCAPE-Bookmark-file-1>');
  });

  test('respects explicit format option', () => {
    const out = path.join(tmpDir, 'out.json');
    const result = exportToFile(sampleBookmarks, out, { format: 'html' });
    expect(result.format).toBe('html');
  });
});

describe('resolveOutputPath', () => {
  test('appends .json if no extension', () => {
    expect(resolveOutputPath('output', 'json')).toBe('output.json');
  });

  test('appends .html if format is html', () => {
    expect(resolveOutputPath('output', 'html')).toBe('output.html');
  });

  test('keeps existing extension', () => {
    expect(resolveOutputPath('output.json', 'html')).toBe('output.json');
  });

  test('returns null if no arg', () => {
    expect(resolveOutputPath(null, 'json')).toBeNull();
  });
});
