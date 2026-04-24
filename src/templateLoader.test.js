const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadTemplates, loadTemplatesFromFile, isReadableFile } = require('./templateLoader');
const { DEFAULT_TEMPLATES } = require('./templateEngine');

describe('isReadableFile', () => {
  test('returns true for existing readable file', () => {
    const tmp = path.join(os.tmpdir(), 'tmpl_test_readable.json');
    fs.writeFileSync(tmp, '{}');
    expect(isReadableFile(tmp)).toBe(true);
    fs.unlinkSync(tmp);
  });

  test('returns false for non-existent file', () => {
    expect(isReadableFile('/nonexistent/path/file.json')).toBe(false);
  });
});

describe('loadTemplatesFromFile', () => {
  test('loads and merges JSON templates', () => {
    const tmp = path.join(os.tmpdir(), 'tmpl_test.json');
    fs.writeFileSync(tmp, JSON.stringify({ item: '{title} | {url}' }));
    const result = loadTemplatesFromFile(tmp);
    expect(result.item).toBe('{title} | {url}');
    expect(result.folder).toBe(DEFAULT_TEMPLATES.folder);
    fs.unlinkSync(tmp);
  });

  test('throws on unsupported extension', () => {
    expect(() => loadTemplatesFromFile('file.txt')).toThrow('Unsupported');
  });

  test('throws on missing file', () => {
    expect(() => loadTemplatesFromFile('/no/such/file.json')).toThrow('not found');
  });

  test('throws if file does not export object', () => {
    const tmp = path.join(os.tmpdir(), 'tmpl_bad.json');
    fs.writeFileSync(tmp, '["not","an","object"]');
    expect(() => loadTemplatesFromFile(tmp)).toThrow(TypeError);
    fs.unlinkSync(tmp);
  });
});

describe('loadTemplates', () => {
  test('returns defaults when no path given', () => {
    const result = loadTemplates(null);
    expect(result).toEqual(DEFAULT_TEMPLATES);
  });

  test('loads from file when path provided', () => {
    const tmp = path.join(os.tmpdir(), 'tmpl_load.json');
    fs.writeFileSync(tmp, JSON.stringify({ summary: 'Done: {total}' }));
    const result = loadTemplates(tmp);
    expect(result.summary).toBe('Done: {total}');
    fs.unlinkSync(tmp);
  });
});
