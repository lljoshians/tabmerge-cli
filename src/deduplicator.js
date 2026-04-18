/**
 * Deduplicates an array of bookmark objects by URL.
 * Keeps the first occurrence and discards duplicates.
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} url
 * @property {string} title
 * @property {string} [folder]
 * @property {number} [addDate]
 */

/**
 * Remove duplicate bookmarks based on URL.
 * @param {Bookmark[]} bookmarks
 * @returns {{ bookmarks: Bookmark[], duplicatesRemoved: number }}
 */
function deduplicateBookmarks(bookmarks) {
  if (!Array.isArray(bookmarks)) {
    throw new TypeError('Expected an array of bookmarks');
  }

  const seen = new Map();
  const unique = [];
  let duplicatesRemoved = 0;

  for (const bookmark of bookmarks) {
    if (!bookmark.url) {
      // Keep bookmarks without a URL (e.g. folder entries) as-is
      unique.push(bookmark);
      continue;
    }

    const normalizedUrl = normalizeUrl(bookmark.url);

    if (seen.has(normalizedUrl)) {
      duplicatesRemoved++;
    } else {
      seen.set(normalizedUrl, true);
      unique.push(bookmark);
    }
  }

  return { bookmarks: unique, duplicatesRemoved };
}

/**
 * Normalize a URL for comparison purposes.
 * Strips trailing slashes and lowercases the protocol/host.
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    // Lowercase protocol and hostname, preserve path case
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname.replace(/\/+$/, '')}${parsed.search}${parsed.hash}`;
  } catch {
    // If URL is invalid, fall back to trimmed lowercase string
    return url.trim().toLowerCase();
  }
}

module.exports = { deduplicateBookmarks, normalizeUrl };
