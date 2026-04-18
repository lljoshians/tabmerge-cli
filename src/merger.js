const { deduplicateBookmarks } = require('./deduplicator');

/**
 * Merge multiple arrays of bookmarks into one deduplicated list.
 * @param {Array<Array<Object>>} bookmarkSets - arrays of bookmark objects
 * @param {Object} options
 * @param {boolean} options.deduplicate - whether to deduplicate (default: true)
 * @param {boolean} options.preserveFolders - keep folder info on conflicts (default: true)
 * @returns {Array<Object>} merged bookmarks
 */
function mergeBookmarks(bookmarkSets, options = {}) {
  const { deduplicate = true, preserveFolders = true } = options;

  if (!Array.isArray(bookmarkSets) || bookmarkSets.length === 0) {
    return [];
  }

  const combined = bookmarkSets.reduce((acc, set, index) => {
    if (!Array.isArray(set)) {
      throw new TypeError(`bookmarkSets[${index}] is not an array`);
    }
    return acc.concat(set);
  }, []);

  if (!deduplicate) {
    return combined;
  }

  const deduped = deduplicateBookmarks(combined);

  if (!preserveFolders) {
    return deduped;
  }

  // Build a map from normalized URL -> all folders seen across duplicates
  const folderMap = {};
  combined.forEach((bookmark) => {
    const url = bookmark.url || '';
    if (!folderMap[url]) {
      folderMap[url] = new Set();
    }
    if (bookmark.folder) {
      folderMap[url].add(bookmark.folder);
    }
  });

  return deduped.map((bookmark) => {
    const folders = folderMap[bookmark.url];
    if (folders && folders.size > 1) {
      return { ...bookmark, folders: Array.from(folders) };
    }
    return bookmark;
  });
}

module.exports = { mergeBookmarks };
