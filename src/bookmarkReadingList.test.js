const {
  addToReadingList,
  removeFromReadingList,
  markAsRead,
  markAsUnread,
  getUnread,
  getRead,
  readingListStats,
} = require('./bookmarkReadingList');

const bm1 = { url: 'https://example.com', title: 'Example' };
const bm2 = { url: 'https://foo.com', title: 'Foo' };

test('addToReadingList adds a bookmark', () => {
  const list = addToReadingList([], bm1);
  expect(list).toHaveLength(1);
  expect(list[0].url).toBe('https://example.com');
  expect(list[0].read).toBe(false);
  expect(list[0].addedAt).toBeDefined();
});

test('addToReadingList does not add duplicate urls', () => {
  let list = addToReadingList([], bm1);
  list = addToReadingList(list, bm1);
  expect(list).toHaveLength(1);
});

test('addToReadingList throws if no url', () => {
  expect(() => addToReadingList([], { title: 'No URL' })).toThrow();
});

test('removeFromReadingList removes by url', () => {
  let list = addToReadingList([], bm1);
  list = addToReadingList(list, bm2);
  list = removeFromReadingList(list, bm1.url);
  expect(list).toHaveLength(1);
  expect(list[0].url).toBe('https://foo.com');
});

test('markAsRead sets read and readAt', () => {
  let list = addToReadingList([], bm1);
  list = markAsRead(list, bm1.url);
  expect(list[0].read).toBe(true);
  expect(list[0].readAt).toBeDefined();
});

test('markAsUnread clears read flag', () => {
  let list = addToReadingList([], bm1);
  list = markAsRead(list, bm1.url);
  list = markAsUnread(list, bm1.url);
  expect(list[0].read).toBe(false);
  expect(list[0].readAt).toBeUndefined();
});

test('getUnread returns only unread', () => {
  let list = addToReadingList([], bm1);
  list = addToReadingList(list, bm2);
  list = markAsRead(list, bm1.url);
  expect(getUnread(list)).toHaveLength(1);
  expect(getUnread(list)[0].url).toBe('https://foo.com');
});

test('getRead returns only read', () => {
  let list = addToReadingList([], bm1);
  list = addToReadingList(list, bm2);
  list = markAsRead(list, bm1.url);
  expect(getRead(list)).toHaveLength(1);
  expect(getRead(list)[0].url).toBe('https://example.com');
});

test('readingListStats returns correct counts', () => {
  let list = addToReadingList([], bm1);
  list = addToReadingList(list, bm2);
  list = markAsRead(list, bm1.url);
  const stats = readingListStats(list);
  expect(stats.total).toBe(2);
  expect(stats.read).toBe(1);
  expect(stats.unread).toBe(1);
});
