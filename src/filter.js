/**
 * Filter bookmarks by various criteria
 */

/**
 * Filter bookmarks by keyword in title or URL
 * @param {Array} bookmarks
 * @param {string} keyword
 * @returns {Array}
 */
function filterByKeyword(bookmarks, keyword) {
  if (!keyword) return bookmarks;
  const lower = keyword.toLowerCase();
  return bookmarks.filter(
    (b) =>
      (b.title && b.title.toLowerCase().includes(lower)) ||
      (b.url && b.url.toLowerCase().includes(lower))
  );
}

/**
 * Filter bookmarks by folder name
 * @param {Array} bookmarks
 * @param {string} folder
 * @returns {Array}
 */
function filterByFolder(bookmarks, folder) {
  if (!folder) return bookmarks;
  const lower = folder.toLowerCase();
  return bookmarks.filter(
    (b) => b.folder && b.folder.toLowerCase() === lower
  );
}

/**
 * Filter bookmarks added after a given date
 * @param {Array} bookmarks
 * @param {Date|string} since
 * @returns {Array}
 */
function filterBySince(bookmarks, since) {
  if (!since) return bookmarks;
  const sinceMs = new Date(since).getTime();
  return bookmarks.filter((b) => b.addDate && b.addDate >= sinceMs);
}

/**
 * Apply all active filters from a filter options object
 * @param {Array} bookmarks
 * @param {{ keyword?: string, folder?: string, since?: string }} opts
 * @returns {Array}
 */
function applyFilters(bookmarks, opts = {}) {
  let result = bookmarks;
  result = filterByKeyword(result, opts.keyword);
  result = filterByFolder(result, opts.folder);
  result = filterBySince(result, opts.since);
  return result;
}

module.exports = { filterByKeyword, filterByFolder, filterBySince, applyFilters };
