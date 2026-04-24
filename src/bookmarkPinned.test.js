const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  loadPinned,
  savePinned,
  pinBookmark,
  unpinBookmark,
  isPinned,
  filterPinned,
  annotatePinned,
} = require('./bookmarkPinned');

function tmpFile() {
  return path.join(os.tmpdir(), `pinned-test-${Date.now()}.json`);
}

test('loadPinned returns empty array if file missing', () => {
  expect(loadPinned('/nonexistent/path.json')).toEqual([]);
});

test('savePinned and loadPinned round-trip', () => {
  const f = tmpFile();
  savePinned(['https://a.com', 'https://b.com'], f);
  expect(loadPinned(f)).toEqual(['https://a.com', 'https://b.com']);
  fs.unlinkSync(f);
});

test('pinBookmark adds url', () => {
  const f = tmpFile();
  pinBookmark({ url: 'https://a.com' }, f);
  expect(loadPinned(f)).toContain('https://a.com');
  fs.unlinkSync(f);
});

test('pinBookmark does not duplicate', () => {
  const f = tmpFile();
  pinBookmark({ url: 'https://a.com' }, f);
  pinBookmark({ url: 'https://a.com' }, f);
  expect(loadPinned(f).length).toBe(1);
  fs.unlinkSync(f);
});

test('pinBookmark throws if no url', () => {
  expect(() => pinBookmark({}, '/tmp/x.json')).toThrow();
});

test('unpinBookmark removes url', () => {
  const f = tmpFile();
  savePinned(['https://a.com', 'https://b.com'], f);
  unpinBookmark('https://a.com', f);
  expect(loadPinned(f)).toEqual(['https://b.com']);
  fs.unlinkSync(f);
});

test('isPinned returns true/false correctly', () => {
  const f = tmpFile();
  savePinned(['https://a.com'], f);
  expect(isPinned('https://a.com', f)).toBe(true);
  expect(isPinned('https://z.com', f)).toBe(false);
  fs.unlinkSync(f);
});

test('filterPinned returns only pinned bookmarks', () => {
  const f = tmpFile();
  savePinned(['https://a.com'], f);
  const bms = [{ url: 'https://a.com' }, { url: 'https://b.com' }];
  expect(filterPinned(bms, f)).toEqual([{ url: 'https://a.com' }]);
  fs.unlinkSync(f);
});

test('annotatePinned sets pinned flag', () => {
  const f = tmpFile();
  savePinned(['https://a.com'], f);
  const bms = [{ url: 'https://a.com' }, { url: 'https://b.com' }];
  const result = annotatePinned(bms, f);
  expect(result[0].pinned).toBe(true);
  expect(result[1].pinned).toBe(false);
  fs.unlinkSync(f);
});
