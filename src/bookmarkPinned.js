/**
 * bookmarkPinned.js
 * Manage a list of pinned (starred) bookmarks with persistence.
 */

const fs = require('fs');

const DEFAULT_PINNED_FILE = '.tabmerge-pinned.json';

function resolvePinnedPath(filePath) {
  return filePath || DEFAULT_PINNED_FILE;
}

function loadPinned(filePath) {
  const target = resolvePinnedPath(filePath);
  if (!fs.existsSync(target)) return [];
  try {
    const raw = fs.readFileSync(target, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function savePinned(urls, filePath) {
  const target = resolvePinnedPath(filePath);
  fs.writeFileSync(target, JSON.stringify(urls, null, 2), 'utf8');
}

function pinBookmark(bookmark, filePath) {
  const pinned = loadPinned(filePath);
  const url = bookmark.url;
  if (!url) throw new Error('Bookmark must have a url');
  if (!pinned.includes(url)) {
    pinned.push(url);
    savePinned(pinned, filePath);
  }
  return pinned;
}

function unpinBookmark(url, filePath) {
  const pinned = loadPinned(filePath);
  const updated = pinned.filter(u => u !== url);
  savePinned(updated, filePath);
  return updated;
}

function isPinned(url, filePath) {
  const pinned = loadPinned(filePath);
  return pinned.includes(url);
}

function filterPinned(bookmarks, filePath) {
  const pinned = loadPinned(filePath);
  const set = new Set(pinned);
  return bookmarks.filter(b => set.has(b.url));
}

function annotatePinned(bookmarks, filePath) {
  const pinned = loadPinned(filePath);
  const set = new Set(pinned);
  return bookmarks.map(b => ({ ...b, pinned: set.has(b.url) }));
}

module.exports = {
  resolvePinnedPath,
  loadPinned,
  savePinned,
  pinBookmark,
  unpinBookmark,
  isPinned,
  filterPinned,
  annotatePinned,
};
