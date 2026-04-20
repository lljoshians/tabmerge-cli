const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  buildArchiveFilename,
  writeArchive,
  listArchives,
  pruneArchives,
} = require('./archiver');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archiver-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('buildArchiveFilename', () => {
  test('includes baseName and extension', () => {
    const name = buildArchiveFilename('mybooks', 'json');
    expect(name).toMatch(/^mybooks_/);
    expect(name).toMatch(/\.json$/);
  });

  test('timestamp portion has expected format', () => {
    const name = buildArchiveFilename('b', 'html');
    // expect something like b_2024-01-15_12-30-00.html
    expect(name).toMatch(/b_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.html/);
  });
});

describe('writeArchive', () => {
  test('creates file in target directory', () => {
    const { filePath, sizeBytes } = writeArchive('{"a":1}', tmpDir, 'test', 'json');
    expect(fs.existsSync(filePath)).toBe(true);
    expect(sizeBytes).toBeGreaterThan(0);
  });

  test('creates directory if it does not exist', () => {
    const nested = path.join(tmpDir, 'nested', 'deep');
    const { filePath } = writeArchive('hello', nested, 'snap', 'txt');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('written content matches input', () => {
    const content = JSON.stringify({ bookmarks: [] });
    const { filePath } = writeArchive(content, tmpDir);
    expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
  });
});

describe('listArchives', () => {
  test('returns empty array for missing dir', () => {
    expect(listArchives('/nonexistent/path')).toEqual([]);
  });

  test('lists only matching files, newest first', () => {
    writeArchive('a', tmpDir, 'snap', 'json');
    writeArchive('b', tmpDir, 'snap', 'json');
    const list = listArchives(tmpDir, 'snap');
    expect(list.length).toBe(2);
    expect(list[0] >= list[1]).toBe(true);
  });
});

describe('pruneArchives', () => {
  test('deletes oldest archives beyond keep limit', () => {
    for (let i = 0; i < 7; i++) writeArchive(`content${i}`, tmpDir, 'arc', 'json');
    const deleted = pruneArchives(tmpDir, 'arc', 4);
    expect(deleted.length).toBe(3);
    expect(listArchives(tmpDir, 'arc').length).toBe(4);
  });

  test('does nothing if under limit', () => {
    writeArchive('x', tmpDir, 'arc', 'json');
    const deleted = pruneArchives(tmpDir, 'arc', 5);
    expect(deleted.length).toBe(0);
  });
});
