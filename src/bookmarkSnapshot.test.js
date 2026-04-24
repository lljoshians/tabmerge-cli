const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildSnapshotFilename,
  saveSnapshot,
  listSnapshots,
  loadSnapshot,
  pruneSnapshots,
} = require('./bookmarkSnapshot');

const sample = [
  { title: 'Google', url: 'https://google.com', folder: 'Search', addDate: 1700000000 },
  { title: 'MDN', url: 'https://developer.mozilla.org', folder: 'Dev', addDate: 1700000001 },
];

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'snapshot-test-'));
}

test('buildSnapshotFilename returns a timestamped filename', () => {
  const name = buildSnapshotFilename();
  expect(name).toMatch(/^snapshot_\d{4}-\d{2}-\d{2}T/);
  expect(name).toEndWith('.json');
});

test('buildSnapshotFilename includes sanitized label', () => {
  const name = buildSnapshotFilename('my label!');
  expect(name).toContain('_my_label_');
});

test('saveSnapshot writes a file and returns its path', () => {
  const dir = tmpDir();
  const filepath = saveSnapshot(sample, { dir });
  expect(fs.existsSync(filepath)).toBe(true);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  expect(data.count).toBe(2);
  expect(data.bookmarks).toHaveLength(2);
  expect(data.label).toBeNull();
});

test('saveSnapshot stores label when provided', () => {
  const dir = tmpDir();
  const filepath = saveSnapshot(sample, { label: 'before-merge', dir });
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  expect(data.label).toBe('before-merge');
});

test('listSnapshots returns sorted snapshot metadata', () => {
  const dir = tmpDir();
  saveSnapshot(sample, { label: 'first', dir });
  saveSnapshot(sample, { label: 'second', dir });
  const list = listSnapshots(dir);
  expect(list).toHaveLength(2);
  expect(list[0].label).toBe('first');
  expect(list[1].label).toBe('second');
});

test('listSnapshots returns empty array when dir does not exist', () => {
  expect(listSnapshots('/nonexistent/path/xyz')).toEqual([]);
});

test('loadSnapshot restores bookmarks from file', () => {
  const dir = tmpDir();
  const filepath = saveSnapshot(sample, { dir });
  const restored = loadSnapshot(filepath);
  expect(restored).toHaveLength(2);
  expect(restored[0].url).toBe('https://google.com');
});

test('loadSnapshot throws when file missing', () => {
  expect(() => loadSnapshot('/no/such/file.json')).toThrow('Snapshot not found');
});

test('pruneSnapshots removes oldest entries beyond keep limit', () => {
  const dir = tmpDir();
  saveSnapshot(sample, { label: 'a', dir });
  saveSnapshot(sample, { label: 'b', dir });
  saveSnapshot(sample, { label: 'c', dir });
  const removed = pruneSnapshots(2, dir);
  expect(removed).toHaveLength(1);
  expect(listSnapshots(dir)).toHaveLength(2);
});
