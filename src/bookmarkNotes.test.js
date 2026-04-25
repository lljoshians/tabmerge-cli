const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  resolveNotesPath,
  loadNotes,
  saveNotes,
  addNote,
  removeNote,
  applyNotes,
  getAnnotatedWithNotes
} = require('./bookmarkNotes');

let tmpFile;
beforeEach(() => {
  tmpFile = path.join(os.tmpdir(), `notes-test-${Date.now()}.json`);
});
afterEach(() => {
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
});

const bookmarks = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://foo.com', title: 'Foo' }
];

test('resolveNotesPath returns provided path', () => {
  expect(resolveNotesPath('/tmp/notes.json')).toBe('/tmp/notes.json');
});

test('loadNotes returns empty object when file missing', () => {
  expect(loadNotes('/nonexistent/path.json')).toEqual({});
});

test('saveNotes and loadNotes round-trip', () => {
  const notes = { 'https://example.com': { text: 'hello', updatedAt: '2024-01-01' } };
  saveNotes(notes, tmpFile);
  expect(loadNotes(tmpFile)).toEqual(notes);
});

test('addNote attaches note to matching bookmark', () => {
  const result = addNote(bookmarks, 'https://example.com', 'great site', tmpFile);
  expect(result[0].note).toBe('great site');
  expect(result[1].note).toBeUndefined();
});

test('addNote persists note to file', () => {
  addNote(bookmarks, 'https://foo.com', 'check later', tmpFile);
  const notes = loadNotes(tmpFile);
  expect(notes['https://foo.com'].text).toBe('check later');
  expect(notes['https://foo.com'].updatedAt).toBeDefined();
});

test('removeNote strips note from bookmark and file', () => {
  addNote(bookmarks, 'https://example.com', 'temp note', tmpFile);
  const result = removeNote(
    bookmarks.map(b => b.url === 'https://example.com' ? { ...b, note: 'temp note' } : b),
    'https://example.com',
    tmpFile
  );
  expect(result[0].note).toBeUndefined();
  expect(loadNotes(tmpFile)['https://example.com']).toBeUndefined();
});

test('applyNotes merges persisted notes onto bookmarks', () => {
  saveNotes({ 'https://foo.com': { text: 'nice', updatedAt: '2024-01-01' } }, tmpFile);
  const result = applyNotes(bookmarks, tmpFile);
  expect(result.find(b => b.url === 'https://foo.com').note).toBe('nice');
  expect(result.find(b => b.url === 'https://example.com').note).toBeUndefined();
});

test('getAnnotatedWithNotes filters to bookmarks with notes', () => {
  const mixed = [
    { url: 'https://a.com', title: 'A', note: 'yes' },
    { url: 'https://b.com', title: 'B' },
    { url: 'https://c.com', title: 'C', note: '  ' }
  ];
  const result = getAnnotatedWithNotes(mixed);
  expect(result).toHaveLength(1);
  expect(result[0].url).toBe('https://a.com');
});
