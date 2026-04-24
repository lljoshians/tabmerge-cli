'use strict';

const { findAdded, findRemoved, findChanged, diffBookmarks, formatDiff } = require('./bookmarkDiff');

const bmA = { url: 'https://example.com/', title: 'Example', folder: 'Work' };
const bmB = { url: 'https://foo.com/', title: 'Foo', folder: 'Personal' };
const bmC = { url: 'https://bar.com/', title: 'Bar', folder: 'Work' };
const bmAChanged = { url: 'https://example.com/', title: 'Example Updated', folder: 'Archive' };

describe('findAdded', () => {
  test('returns bookmarks in next but not prev', () => {
    const added = findAdded([bmA], [bmA, bmB]);
    expect(added).toHaveLength(1);
    expect(added[0].url).toBe(bmB.url);
  });

  test('returns empty when nothing new', () => {
    expect(findAdded([bmA, bmB], [bmA])).toHaveLength(0);
  });
});

describe('findRemoved', () => {
  test('returns bookmarks in prev but not next', () => {
    const removed = findRemoved([bmA, bmB], [bmA]);
    expect(removed).toHaveLength(1);
    expect(removed[0].url).toBe(bmB.url);
  });

  test('returns empty when nothing removed', () => {
    expect(findRemoved([bmA], [bmA, bmB])).toHaveLength(0);
  });
});

describe('findChanged', () => {
  test('detects title change', () => {
    const changed = findChanged([bmA], [bmAChanged]);
    expect(changed).toHaveLength(1);
    expect(changed[0].before.title).toBe('Example');
    expect(changed[0].after.title).toBe('Example Updated');
  });

  test('detects folder change', () => {
    const changed = findChanged([bmA], [bmAChanged]);
    expect(changed[0].before.folder).toBe('Work');
    expect(changed[0].after.folder).toBe('Archive');
  });

  test('returns empty when no changes', () => {
    expect(findChanged([bmA], [bmA])).toHaveLength(0);
  });
});

describe('diffBookmarks', () => {
  test('returns full diff object', () => {
    const diff = diffBookmarks([bmA, bmB], [bmAChanged, bmC]);
    expect(diff.added).toHaveLength(1);
    expect(diff.removed).toHaveLength(1);
    expect(diff.changed).toHaveLength(1);
  });
});

describe('formatDiff', () => {
  test('produces readable string', () => {
    const diff = diffBookmarks([bmA], [bmB, bmAChanged]);
    const output = formatDiff(diff);
    expect(output).toContain('Added');
    expect(output).toContain('Removed');
    expect(output).toContain('Changed');
    expect(output).toContain('Foo');
  });
});
