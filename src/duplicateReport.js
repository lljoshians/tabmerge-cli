/**
 * duplicateReport.js
 * Generates a report of duplicate bookmarks found during deduplication.
 */

/**
 * Builds a duplicate report from original and deduplicated bookmark arrays.
 * @param {Array} original - Original bookmarks before deduplication
 * @param {Array} deduped - Bookmarks after deduplication
 * @returns {Object} report object
 */
function buildDuplicateReport(original, deduped) {
  const dedupedUrls = new Set(deduped.map((b) => b.url));
  const duplicates = original.filter((b) => !dedupedUrls.has(b.url));

  const grouped = {};
  for (const bookmark of duplicates) {
    const url = bookmark.url;
    if (!grouped[url]) {
      grouped[url] = [];
    }
    grouped[url].push(bookmark);
  }

  return {
    totalOriginal: original.length,
    totalAfterDedup: deduped.length,
    duplicatesRemoved: original.length - deduped.length,
    duplicateGroups: Object.entries(grouped).map(([url, items]) => ({
      url,
      count: items.length,
      titles: items.map((b) => b.title),
      folders: items.map((b) => b.folder || null),
    })),
  };
}

/**
 * Formats a duplicate report as a human-readable string.
 * @param {Object} report - Report from buildDuplicateReport
 * @returns {string}
 */
function formatDuplicateReport(report) {
  const lines = [];
  lines.push(`Duplicate Report`);
  lines.push(`----------------`);
  lines.push(`Total bookmarks (original): ${report.totalOriginal}`);
  lines.push(`After deduplication:        ${report.totalAfterDedup}`);
  lines.push(`Duplicates removed:         ${report.duplicatesRemoved}`);

  if (report.duplicateGroups.length === 0) {
    lines.push(`\nNo duplicates found.`);
  } else {
    lines.push(`\nDuplicate URLs (${report.duplicateGroups.length} unique):`);
    for (const group of report.duplicateGroups) {
      lines.push(`  URL: ${group.url}`);
      lines.push(`    Occurrences: ${group.count}`);
      lines.push(`    Titles: ${group.titles.join(', ')}`);
    }
  }

  return lines.join('\n');
}

module.exports = { buildDuplicateReport, formatDuplicateReport };
