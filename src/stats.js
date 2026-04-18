/**
 * Generate statistics about bookmark collections
 */

/**
 * @param {Array} bookmarks
 * @returns {Object} stats
 */
function computeStats(bookmarks) {
  const folders = new Set();
  const domains = new Map();
  const duplicates = { count: 0, urls: [] };
  const seen = new Set();

  for (const bookmark of bookmarks) {
    if (bookmark.folder) folders.add(bookmark.folder);

    try {
      const url = new URL(bookmark.url);
      const domain = url.hostname;
      domains.set(domain, (domains.get(domain) || 0) + 1);
    } catch (_) {
      // skip invalid URLs
    }

    if (seen.has(bookmark.url)) {
      duplicates.count++;
      duplicates.urls.push(bookmark.url);
    } else {
      seen.add(bookmark.url);
    }
  }

  const topDomains = [...domains.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([domain, count]) => ({ domain, count }));

  return {
    total: bookmarks.length,
    unique: seen.size,
    duplicates,
    folders: [...folders],
    folderCount: folders.size,
    topDomains,
  };
}

/**
 * Format stats as a human-readable string
 * @param {Object} stats
 * @returns {string}
 */
function formatStats(stats) {
  const lines = [
    `Total bookmarks : ${stats.total}`,
    `Unique bookmarks: ${stats.unique}`,
    `Duplicates found: ${stats.duplicates.count}`,
    `Folders         : ${stats.folderCount}`,
    ``,
    `Top domains:`,
    ...stats.topDomains.map((d) => `  ${d.domain} (${d.count})`),
  ];
  return lines.join('\n');
}

module.exports = { computeStats, formatStats };
