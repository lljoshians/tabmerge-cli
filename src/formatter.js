/**
 * formatter.js
 * Converts deduplicated bookmark data into JSON or HTML output formats.
 */

/**
 * Format bookmarks as a pretty-printed JSON string.
 * @param {Array} bookmarks - Array of bookmark objects
 * @returns {string} JSON string
 */
function formatAsJson(bookmarks) {
  return JSON.stringify(bookmarks, null, 2);
}

/**
 * Escape HTML special characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Group bookmarks by their folder/category field.
 * @param {Array} bookmarks
 * @returns {Object} Map of folder name -> bookmarks array
 */
function groupByFolder(bookmarks) {
 (const bookmark of bookmarks) folder || 'Bookmarks';
    if (!groups[folder]) groups[folder] = [];
    groups[folder].push(bookmark);
  }
  return groups;
}

/**
 * Format bookmarks as a Netscape Bookmark HTML file (compatible with
 * Chrome, Firefox, and most browsers for import).
 * @param {Array} bookmarks - Array of bookmark objects
 * @returns {string} HTML string
 */
function formatAsHtml(bookmarks) {
  const groups = groupByFolder(bookmarks);

  const lines = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file. -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
  ];

  for (const [folder, items] of Object.entries(groups)) {
    lines.push(`    <DT><H3>${escapeHtml(folder)}</H3>`);
    lines.push('    <DL><p>');
    for (const bookmark of items) {
      const title = escapeHtml(bookmark.title || bookmark.url);
      const url = escapeHtml(bookmark.url);
      const addDate = bookmark.addDate ? ` ADD_DATE="${bookmark.addDate}"` : '';
      lines.push(`        <DT><A HREF="${url}"${addDate}>${title}</A>`);
    }
    lines.push('    </DL><p>');
  }

  lines.push('</DL><p>');
  return lines.join('\n');
}

/**
 * Format bookmarks into the requested output format.
 * @param {Array} bookmarks - Array of bookmark objects
 * @param {'json'|'html'} format - Output format
 * @returns {string} Formatted string
 */
function formatBookmarks(bookmarks, format = 'json') {
  switch (format.toLowerCase()) {
    case 'html':
      return formatAsHtml(bookmarks);
    case 'json':
      return formatAsJson(bookmarks);
    default:
      throw new Error(`Unsupported format: "${format}". Use "json" or "html".`);
  }
}

module.exports = { formatBookmarks, formatAsJson, formatAsHtml, groupByFolder };
