// bookmarkFavorites.js — manage a persistent list of favorite bookmarks
const fs = require('fs');
const path = require('path');

const DEFAULT_FAVORITES_FILE = path.join(process.cwd(), '.tabmerge-favorites.json');

function resolveFavoritesPath(filePath) {
  return filePath || process.env.TABMERGE_FAVORITES_FILE || DEFAULT_FAVORITES_FILE;
}

function loadFavorites(filePath) {
  const resolved = resolveFavoritesPath(filePath);
  if (!fs.existsSync(resolved)) return [];
  try {
    const raw = fs.readFileSync(resolved, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites, filePath) {
  const resolved = resolveFavoritesPath(filePath);
  fs.writeFileSync(resolved, JSON.stringify(favorites, null, 2), 'utf8');
}

function addFavorite(bookmark, filePath) {
  const favorites = loadFavorites(filePath);
  const alreadyFav = favorites.some(f => f.url === bookmark.url);
  if (alreadyFav) return favorites;
  const updated = [...favorites, { ...bookmark, favoritedAt: new Date().toISOString() }];
  saveFavorites(updated, filePath);
  return updated;
}

function removeFavorite(url, filePath) {
  const favorites = loadFavorites(filePath);
  const updated = favorites.filter(f => f.url !== url);
  saveFavorites(updated, filePath);
  return updated;
}

function isFavorite(url, filePath) {
  const favorites = loadFavorites(filePath);
  return favorites.some(f => f.url === url);
}

function getFavorites(filePath) {
  return loadFavorites(filePath);
}

function markFavoritesInList(bookmarks, filePath) {
  const favorites = loadFavorites(filePath);
  const favUrls = new Set(favorites.map(f => f.url));
  return bookmarks.map(b => ({ ...b, isFavorite: favUrls.has(b.url) }));
}

module.exports = {
  resolveFavoritesPath,
  loadFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorites,
  markFavoritesInList,
};
