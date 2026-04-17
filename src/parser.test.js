const path = require('path');
const fs = require('fs');
const os = require('os');
const { parseBookmarkFile } = require('./parser');

const SAMPLE_HTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
  <DT><A HREF="https://example.com" ADD_DATE="1700000000" TAGS="dev,tools">Example</A>
  <DT><A HREF="https://openai.com" ADD_DATE="1700000001">OpenAI</A>
  <DT><A HREF="" ADD_DATE="1700000002">No URL</A>
</DL>` tmpFile;

beforeAll(() => {
  tmpFile = path.join(os.tmpdir(), 'test_book.writeFileSync(tmpFile, SAMPLE_HTML, 'utf-8');
terAll(() => {
  fs.unlinkSync(tmpFile);
});

test('parses bookmarks from a valid HTML file', () => {
  const bookmarks = parseBookmarkFile(tmpFile);
  expect(bookmarks).toHaveLength(2); // entry with no URL is skipped
});

test('parses url and title correctly', () => {
  const bookmarks = parseBookmarkFile(tmpFile);
  expect(bookmarks[0].url).toBe('https://example.com');
  expect(bookmarks[0].title).toBe('Example');
});

test('parses addDate as integer', () => {
  const bookmarks = parseBookmarkFile(tmpFile);
  expect(bookmarks[0].addDate).toBe(1700000000);
});

test('parses tags correctly', () => {
  const bookmarks = parseBookmarkFile(tmpFile);
  expect(bookmarks[0].tags).toEqual(['dev', 'tools']);
  expect(bookmarks[1].tags).toEqual([]);
});

test('throws if file does not exist', () => {
  expect(() => parseBookmarkFile('/nonexistent/file.html')).toThrow('File not found');
});
