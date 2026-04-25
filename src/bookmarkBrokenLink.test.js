const { checkUrl, findBrokenLinks, formatBrokenReport } = require('./bookmarkBrokenLink');

describe('checkUrl', () => {
  it('returns ok:false for an invalid URL', async () => {
    const result = await checkUrl('not-a-url');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('invalid url');
  });

  it('returns ok:false on connection error', async () => {
    const result = await checkUrl('http://localhost:19999/no-such-server', 500);
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('findBrokenLinks', () => {
  it('returns empty array when all bookmarks are skipped (no url)', async () => {
    const bookmarks = [{ title: 'No URL' }, { title: 'Also no URL' }];
    const broken = await findBrokenLinks(bookmarks);
    expect(broken).toEqual([]);
  });

  it('reports broken links for unreachable hosts', async () => {
    const bookmarks = [
      { title: 'Bad', url: 'http://localhost:19999/nope' },
      { title: 'Also Bad', url: 'http://localhost:19998/nope' },
    ];
    const broken = await findBrokenLinks(bookmarks, { concurrency: 2, timeoutMs: 500 });
    expect(broken.length).toBe(2);
    expect(broken[0]).toHaveProperty('bookmark');
    expect(broken[0]).toHaveProperty('result');
    expect(broken[0].result.ok).toBe(false);
  });

  it('handles empty bookmark list', async () => {
    const broken = await findBrokenLinks([]);
    expect(broken).toEqual([]);
  });

  it('skips bookmarks without url field', async () => {
    const broken = await findBrokenLinks([{ title: 'No url field' }]);
    expect(broken).toEqual([]);
  });
});

describe('formatBrokenReport', () => {
  it('returns friendly message when no broken links', () => {
    expect(formatBrokenReport([])).toBe('No broken links found.');
  });

  it('formats broken links with status', () => {
    const broken = [
      { bookmark: { title: 'Example', url: 'http://example.com' }, result: { ok: false, status: 404, error: null } },
    ];
    const report = formatBrokenReport(broken);
    expect(report).toContain('1 broken link');
    expect(report).toContain('HTTP 404');
    expect(report).toContain('Example');
    expect(report).toContain('http://example.com');
  });

  it('formats broken links with error message when no status', () => {
    const broken = [
      { bookmark: { title: 'Gone', url: 'http://gone.example' }, result: { ok: false, status: null, error: 'timeout' } },
    ];
    const report = formatBrokenReport(broken);
    expect(report).toContain('timeout');
    expect(report).toContain('Gone');
  });

  it('uses (no title) fallback when title is missing', () => {
    const broken = [
      { bookmark: { url: 'http://x.example' }, result: { ok: false, status: null, error: 'timeout' } },
    ];
    const report = formatBrokenReport(broken);
    expect(report).toContain('(no title)');
  });
});
