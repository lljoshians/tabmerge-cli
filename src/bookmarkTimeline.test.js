const {
  toMonthKey,
  toYearKey,
  groupByMonth,
  groupByYear,
  buildTimeline,
  generateTimeline,
} = require('./bookmarkTimeline');

const bm = (url, addDate) => ({ url, title: url, addDate });

const bookmarks = [
  bm('https://a.com', '2023-01-15'),
  bm('https://b.com', '2023-01-20'),
  bm('https://c.com', '2023-03-05'),
  bm('https://d.com', '2024-06-01'),
  bm('https://e.com', null),
];

describe('toMonthKey', () => {
  test('formats date to YYYY-MM', () => {
    expect(toMonthKey('2023-01-15')).toBe('2023-01');
    expect(toMonthKey('2024-12-31')).toBe('2024-12');
  });
});

describe('toYearKey', () => {
  test('formats date to YYYY', () => {
    expect(toYearKey('2023-01-15')).toBe('2023');
    expect(toYearKey('2024-06-01')).toBe('2024');
  });
});

describe('groupByMonth', () => {
  test('groups bookmarks by month', () => {
    const groups = groupByMonth(bookmarks);
    expect(groups['2023-01']).toHaveLength(2);
    expect(groups['2023-03']).toHaveLength(1);
    expect(groups['2024-06']).toHaveLength(1);
    expect(groups['unknown']).toHaveLength(1);
  });
});

describe('groupByYear', () => {
  test('groups bookmarks by year', () => {
    const groups = groupByYear(bookmarks);
    expect(groups['2023']).toHaveLength(3);
    expect(groups['2024']).toHaveLength(1);
    expect(groups['unknown']).toHaveLength(1);
  });
});

describe('buildTimeline', () => {
  test('returns sorted array with period, count, bookmarks', () => {
    const buckets = { '2023-03': [bm('x', '2023-03-01')], '2023-01': [bm('y', '2023-01-01')] };
    const tl = buildTimeline(buckets);
    expect(tl[0].period).toBe('2023-01');
    expect(tl[1].period).toBe('2023-03');
    expect(tl[0].count).toBe(1);
  });

  test('places unknown at the end', () => {
    const buckets = { unknown: [bm('z', null)], '2022-05': [bm('w', '2022-05-01')] };
    const tl = buildTimeline(buckets);
    expect(tl[tl.length - 1].period).toBe('unknown');
  });
});

describe('generateTimeline', () => {
  test('default granularity is month', () => {
    const tl = generateTimeline(bookmarks);
    expect(tl.some(t => t.period === '2023-01')).toBe(true);
  });

  test('year granularity groups correctly', () => {
    const tl = generateTimeline(bookmarks, 'year');
    const y2023 = tl.find(t => t.period === '2023');
    expect(y2023.count).toBe(3);
  });

  test('empty bookmarks returns empty array', () => {
    expect(generateTimeline([])).toEqual([]);
  });
});
