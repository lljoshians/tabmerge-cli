const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  resolveHistoryPath,
  loadHistory,
  saveHistory,
  recordExport,
  getHistory,
  clearHistory,
  formatHistoryEntry,
  formatHistory,
} = require('./bookmarkExportHistory');

function tmpFile() {
  return path.join(os.tmpdir(), `tabmerge-hist-${Date.now()}.json`);
}

afterEach(() => {
  // cleanup handled per test
});

test('resolveHistoryPath returns absolute path for relative input', () => {
  const result = resolveHistoryPath('my-history.json');
  expect(path.isAbsolute(result)).toBe(true);
  expect(result).toContain('my-history.json');
});

test('loadHistory returns empty array when file does not exist', () => {
  const result = loadHistory('/nonexistent/path/history.json');
  expect(result).toEqual([]);
});

test('saveHistory and loadHistory round-trip', () => {
  const file = tmpFile();
  const entries = [{ timestamp: '2024-01-01T00:00:00.000Z', format: 'json', bookmarkCount: 5, outputPath: 'out.json', sources: ['a.html'] }];
  saveHistory(entries, file);
  const loaded = loadHistory(file);
  expect(loaded).toEqual(entries);
  fs.unlinkSync(file);
});

test('loadHistory returns empty array on malformed JSON', () => {
  const file = tmpFile();
  fs.writeFileSync(file, 'not json', 'utf8');
  expect(loadHistory(file)).toEqual([]);
  fs.unlinkSync(file);
});

test('recordExport appends an entry and returns it', () => {
  const file = tmpFile();
  const entry = recordExport({ outputPath: 'out.json', format: 'json', bookmarkCount: 10, sources: ['a.html'], historyFile: file });
  expect(entry.format).toBe('json');
  expect(entry.bookmarkCount).toBe(10);
  expect(entry.sources).toEqual(['a.html']);
  const history = loadHistory(file);
  expect(history.length).toBe(1);
  fs.unlinkSync(file);
});

test('clearHistory empties the history file', () => {
  const file = tmpFile();
  recordExport({ format: 'html', bookmarkCount: 3, historyFile: file });
  clearHistory(file);
  expect(getHistory(file)).toEqual([]);
  fs.unlinkSync(file);
});

test('formatHistoryEntry produces a readable string', () => {
  const entry = { timestamp: '2024-06-15T12:30:00.000Z', format: 'html', bookmarkCount: 7, outputPath: 'result.html', sources: ['b.html'] };
  const str = formatHistoryEntry(entry);
  expect(str).toContain('html');
  expect(str).toContain('7');
  expect(str).toContain('result.html');
});

test('formatHistory returns no-history message for empty array', () => {
  expect(formatHistory([])).toMatch(/no export history/i);
});

test('formatHistory returns one line per entry', () => {
  const entries = [
    { timestamp: '2024-01-01T00:00:00.000Z', format: 'json', bookmarkCount: 1, outputPath: 'a.json', sources: [] },
    { timestamp: '2024-02-01T00:00:00.000Z', format: 'html', bookmarkCount: 2, outputPath: 'b.html', sources: [] },
  ];
  const result = formatHistory(entries);
  expect(result.split('\n').length).toBe(2);
});
