const { sortByTitle, sortByDate, sortByFolder, applySort } = require('./sorter');

const bookmarks = [
  { title: 'Zebra', url: 'https://zebra.com', folder: 'Animals', addDate: '2023-03-01' },
  { title: 'Apple', url: 'https://apple.com', folder: 'Tech', addDate: '2021-01-15' },
  { title: 'Mango', url: 'https://mango.com', folder: 'Fruits', addDate: '2022-06-20' },
];

describe('sortByTitle', () => {
  test('sorts ascending by default', () => {
    const result = sortByTitle(bookmarks);
    expect(result[0].title).toBe('Apple');
    expect(result[2].title).toBe('Zebra');
  });

  test('sorts descending', () => {
    const result = sortByTitle(bookmarks, 'desc');
    expect(result[0].title).toBe('Zebra');
    expect(result[2].title).toBe('Apple');
  });

  test('does not mutate original array', () => {
    sortByTitle(bookmarks);
    expect(bookmarks[0].title).toBe('Zebra');
  });
});

describe('sortByDate', () => {
  test('sorts ascending by date', () => {
    const result = sortByDate(bookmarks);
    expect(result[0].title).toBe('Apple');
    expect(result[2].title).toBe('Zebra');
  });

  test('sorts descending by date', () => {
    const result = sortByDate(bookmarks, 'desc');
    expect(result[0].title).toBe('Zebra');
  });

  test('handles missing addDate', () => {
    const data = [{ title: 'No Date', url: 'https://x.com' }, ...bookmarks];
    const result = sortByDate(data, 'asc');
    expect(result[0].title).toBe('No Date');
  });
});

describe('sortByFolder', () => {
  test('sorts by folder name ascending', () => {
    const result = sortByFolder(bookmarks);
    expect(result[0].folder).toBe('Animals');
    expect(result[2].folder).toBe('Tech');
  });
});

describe('applySort', () => {
  test('defaults to title asc', () => {
    const result = applySort(bookmarks);
    expect(result[0].title).toBe('Apple');
  });

  test('sorts by date desc via options', () => {
    const result = applySort(bookmarks, { by: 'date', order: 'desc' });
    expect(result[0].title).toBe('Zebra');
  });

  test('sorts by folder', () => {
    const result = applySort(bookmarks, { by: 'folder' });
    expect(result[0].folder).toBe('Animals');
  });
});
