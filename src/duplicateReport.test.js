const { buildDuplicateReport, formatDuplicateReport } = require('./duplicateReport');

const original = [
  { url: 'https://example.com', title: 'Example', folder: 'Work' },
  { url: 'https://example.com', title: 'Example Dupe', folder: 'Personal' },
  { url: 'https://foo.com', title: 'Foo', folder: 'Work' },
  { url: 'https://bar.com', title: 'Bar', folder: null },
  { url: 'https://bar.com', title: 'Bar Again', folder: 'Misc' },
];

const deduped = [
  { url: 'https://example.com', title: 'Example', folder: 'Work' },
  { url: 'https://foo.com', title: 'Foo', folder: 'Work' },
  { url: 'https://bar.com', title: 'Bar', folder: null },
];

describe('buildDuplicateReport', () => {
  test('counts original and deduped totals correctly', () => {
    const report = buildDuplicateReport(original, deduped);
    expect(report.totalOriginal).toBe(5);
    expect(report.totalAfterDedup).toBe(3);
    expect(report.duplicatesRemoved).toBe(2);
  });

  test('groups duplicates by URL', () => {
    const report = buildDuplicateReport(original, deduped);
    expect(report.duplicateGroups).toHaveLength(2);
    const exampleGroup = report.duplicateGroups.find(
      (g) => g.url === 'https://example.com'
    );
    expect(exampleGroup).toBeDefined();
    expect(exampleGroup.count).toBe(1);
    expect(exampleGroup.titles).toContain('Example Dupe');
  });

  test('returns empty duplicateGroups when no duplicates', () => {
    const report = buildDuplicateReport(deduped, deduped);
    expect(report.duplicatesRemoved).toBe(0);
    expect(report.duplicateGroups).toHaveLength(0);
  });

  test('includes folder info in duplicate groups', () => {
    const report = buildDuplicateReport(original, deduped);
    const barGroup = report.duplicateGroups.find(
      (g) => g.url === 'https://bar.com'
    );
    expect(barGroup.folders).toContain('Misc');
  });
});

describe('formatDuplicateReport', () => {
  test('includes summary counts', () => {
    const report = buildDuplicateReport(original, deduped);
    const text = formatDuplicateReport(report);
    expect(text).toContain('Total bookmarks (original): 5');
    expect(text).toContain('After deduplication:        3');
    expect(text).toContain('Duplicates removed:         2');
  });

  test('lists duplicate URLs', () => {
    const report = buildDuplicateReport(original, deduped);
    const text = formatDuplicateReport(report);
    expect(text).toContain('https://example.com');
    expect(text).toContain('https://bar.com');
  });

  test('shows no duplicates message when clean', () => {
    const report = buildDuplicateReport(deduped, deduped);
    const text = formatDuplicateReport(report);
    expect(text).toContain('No duplicates found.');
  });
});
