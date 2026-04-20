/**
 * bookmarkCounter.js
 * Provides counting and summary utilities for bookmark collections.
 */

/**
 * Count total bookmarks in a flat array.
 * @param {Array} bookmarks
 * @returns {number}
 */
function countTotal(bookmarks) {
  if (!Array.isArray(bookmarks)) return 0;
  return bookmarks.length;
}

/**
 * Count bookmarks grouped by folder name.
 * @param {Array} bookmarks
 * @returns {Object} map of folder -> count
 */
function countByFolder(bookmarks) {
  if (!Array.isArray(bookmarks)) return {};
  return bookmarks.reduce((acc, bm) => {
    const folder = bm.folder || 'Uncategorized';
    acc[folder] = (acc[folder] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Count bookmarks grouped by domain.
 * @param {Array} bookmarks
 * @returns {Object} map of domain -> count
 */
function countByDomain(bookmarks) {
  if (!Array.isArray(bookmarks)) return {};
  return bookmarks.reduce((acc, bm) => {
    try {
      const domain = new URL(bm.url).hostname;
      acc[domain] = (acc[domain] || 0) + 1;
    } catch (_) {
      acc['invalid'] = (acc['invalid'] || 0) + 1;
    }
    return acc;
  }, {});
}

/**
 * Return top N entries from a count map, sorted descending.
 * @param {Object} countMap
 * @param {number} n
 * @returns {Array} [{key, count}]
 */
function topN(countMap, n = 5) {
  return Object.entries(countMap)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Build a full count summary for a bookmark array.
 * @param {Array} bookmarks
 * @returns {Object}
 */
function buildCountSummary(bookmarks) {
  const total = countTotal(bookmarks);
  const byFolder = countByFolder(bookmarks);
  const byDomain = countByDomain(bookmarks);
  return {
    total,
    uniqueFolders: Object.keys(byFolder).length,
    uniqueDomains: Object.keys(byDomain).length,
    byFolder,
    byDomain,
    topFolders: topN(byFolder, 5),
    topDomains: topN(byDomain, 5),
  };
}

module.exports = { countTotal, countByFolder, countByDomain, topN, buildCountSummary };
