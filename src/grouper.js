/**
 * Groups bookmarks by various criteria for structured output
 */

/**
 * Groups bookmarks by their folder/directory
 * @param {Array} bookmarks
 * @returns {Object} map of folder -> bookmarks[]
 */
function groupByFolder(bookmarks) {
  return bookmarks.reduce((acc, bookmark) => {
    const folder = bookmark.folder || 'Uncategorized';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(bookmark);
    return acc;
  }, {});
}

/**
 * Groups bookmarks by domain extracted from URL
 * @param {Array} bookmarks
 * @returns {Object} map of domain -> bookmarks[]
 */
function groupByDomain(bookmarks) {
  return bookmarks.reduce((acc, bookmark) => {
    let domain = 'unknown';
    try {
      const url = new URL(bookmark.url);
      domain = url.hostname.replace(/^www\./, '');
    } catch (_) {}
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(bookmark);
    return acc;
  }, {});
}

/**
 * Groups bookmarks by date (YYYY-MM-DD)
 * @param {Array} bookmarks
 * @returns {Object} map of date string -> bookmarks[]
 */
function groupByDate(bookmarks) {
  return bookmarks.reduce((acc, bookmark) => {
    let dateKey = 'unknown';
    if (bookmark.addDate) {
      const d = new Date(typeof bookmark.addDate === 'number' ? bookmark.addDate * 1000 : bookmark.addDate);
      if (!isNaN(d)) dateKey = d.toISOString().slice(0, 10);
    }
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(bookmark);
    return acc;
  }, {});
}

/**
 * Applies a grouping strategy by name
 * @param {Array} bookmarks
 * @param {'folder'|'domain'|'date'} strategy
 * @returns {Object}
 */
function applyGrouping(bookmarks, strategy) {
  switch (strategy) {
    case 'domain': return groupByDomain(bookmarks);
    case 'date': return groupByDate(bookmarks);
    case 'folder':
    default: return groupByFolder(bookmarks);
  }
}

module.exports = { groupByFolder, groupByDomain, groupByDate, applyGrouping };
