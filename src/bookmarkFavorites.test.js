const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  resolveFavoritesPath,
  loadFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorites,
  markFavoritesInList,
} = require('./bookmarkFavorites');

const tmpFile = path.join(os.tmpdir(), `tabmerge-favs-test-${Date.now()}.json`);

afterEach(() => {
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
});

const bm1 = { url: 'https://example.com', title: 'Example' };
const bm2 = { url: 'https://github.com', title: 'GitHub' };

test('resolveFavoritesPath returns provided path', () => {
  expect(resolveFavoritesPath('/custom/path.json')).toBe('/custom/path.json');
});

test('loadFavorites returns empty array when file missing', () => {
  expect(loadFavorites(tmpFile)).toEqual([]);
});

test('saveFavorites and loadFavorites roundtrip', () => {
  saveFavorites([bm1], tmpFile);
  const loaded = loadFavorites(tmpFile);
  expect(loaded).toHaveLength(1);
  expect(loaded[0].url).toBe(bm1.url);
});

test('addFavorite adds bookmark with favoritedAt', () => {
  const result = addFavorite(bm1, tmpFile);
  expect(result).toHaveLength(1);
  expect(result[0].favoritedAt).toBeDefined();
});

test('addFavorite does not duplicate', () => {
  addFavorite(bm1, tmpFile);
  const result = addFavorite(bm1, tmpFile);
  expect(result).toHaveLength(1);
});

test('removeFavorite removes by url', () => {
  addFavorite(bm1, tmpFile);
  addFavorite(bm2, tmpFile);
  const result = removeFavorite(bm1.url, tmpFile);
  expect(result).toHaveLength(1);
  expect(result[0].url).toBe(bm2.url);
});

test('isFavorite returns true for favorited url', () => {
  addFavorite(bm1, tmpFile);
  expect(isFavorite(bm1.url, tmpFile)).toBe(true);
  expect(isFavorite(bm2.url, tmpFile)).toBe(false);
});

test('getFavorites returns all favorites', () => {
  addFavorite(bm1, tmpFile);
  addFavorite(bm2, tmpFile);
  expect(getFavorites(tmpFile)).toHaveLength(2);
});

test('markFavoritesInList annotates bookmarks correctly', () => {
  addFavorite(bm1, tmpFile);
  const result = markFavoritesInList([bm1, bm2], tmpFile);
  expect(result[0].isFavorite).toBe(true);
  expect(result[1].isFavorite).toBe(false);
});
