// bookmarkReadingList.js — manage a "read later" reading list for bookmarks

const fs = require('fs');
const path = require('path');

function resolveReadingListPath(filePath) {
  return filePath || path.join(process.env.HOME || '.', '.tabmerge_reading_list.json');
}

function loadReadingList(filePath) {
  const resolved = resolveReadingListPath(filePath);
  if (!fs.existsSync(resolved)) return [];
  try {
    const raw = fs.readFileSync(resolved, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveReadingList(list, filePath) {
  const resolved = resolveReadingListPath(filePath);
  fs.writeFileSync(resolved, JSON.stringify(list, null, 2), 'utf8');
}

function addToReadingList(list, bookmark) {
  if (!bookmark || !bookmark.url) throw new Error('Bookmark must have a url');
  const already = list.some(b => b.url === bookmark.url);
  if (already) return list;
  return [...list, { ...bookmark, addedAt: bookmark.addedAt || new Date().toISOString(), read: false }];
}

function removeFromReadingList(list, url) {
  return list.filter(b => b.url !== url);
}

function markAsRead(list, url) {
  return list.map(b => b.url === url ? { ...b, read: true, readAt: new Date().toISOString() } : b);
}

function markAsUnread(list, url) {
  return list.map(b => b.url === url ? { ...b, read: false, readAt: undefined } : b);
}

function getUnread(list) {
  return list.filter(b => !b.read);
}

function getRead(list) {
  return list.filter(b => b.read);
}

function readingListStats(list) {
  return {
    total: list.length,
    read: list.filter(b => b.read).length,
    unread: list.filter(b => !b.read).length,
  };
}

module.exports = {
  resolveReadingListPath,
  loadReadingList,
  saveReadingList,
  addToReadingList,
  removeFromReadingList,
  markAsRead,
  markAsUnread,
  getUnread,
  getRead,
  readingListStats,
};
