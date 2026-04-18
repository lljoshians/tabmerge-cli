const { parseArgs } = require('./cli');

describe('parseArgs', () => {
  test('parses input files', () => {
    const opts = parseArgs(['node', 'cli.js', 'a.html', 'b.html']);
    expect(opts.files).toEqual(['a.html', 'b.html']);
  });

  test('defaults to json format', () => {
    const opts = parseArgs(['node', 'cli.js', 'a.html', 'b.html']);
    expect(opts.format).toBe('json');
  });

  test('parses -f html', () => {
    const opts = parseArgs(['node', 'cli.js', '-f', 'html', 'a.html', 'b.html']);
    expect(opts.format).toBe('html');
  });

  test('parses --format json', () => {
    const opts = parseArgs(['node', 'cli.js', '--format', 'json', 'a.html', 'b.html']);
    expect(opts.format).toBe('json');
  });

  test('parses -o output file', () => {
    const opts = parseArgs(['node', 'cli.js', '-o', 'out.json', 'a.html', 'b.html']);
    expect(opts.output).toBe('out.json');
  });

  test('parses --output output file', () => {
    const opts = parseArgs(['node', 'cli.js', '--output', 'result.html', 'a.html', 'b.html']);
    expect(opts.output).toBe('result.html');
  });

  test('dedup is true by default', () => {
    const opts = parseArgs(['node', 'cli.js', 'a.html', 'b.html']);
    expect(opts.dedup).toBe(true);
  });

  test('parses --no-dedup flag', () => {
    const opts = parseArgs(['node', 'cli.js', '--no-dedup', 'a.html', 'b.html']);
    expect(opts.dedup).toBe(false);
  });

  test('handles multiple input files', () => {
    const opts = parseArgs(['node', 'cli.js', 'a.html', 'b.html', 'c.html']);
    expect(opts.files).toHaveLength(3);
  });

  test('output defaults to null', () => {
    const opts = parseArgs(['node', 'cli.js', 'a.html', 'b.html']);
    expect(opts.output).toBeNull();
  });
});
