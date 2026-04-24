/**
 * bookmarkSearch.js
 * Full-text search across bookmark titles, URLs, and folders.
 */

/**
 * Normalizes a string for case-insensitive comparison.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

/**
 * Checks whether a bookmark matches a given query string.
 * Searches title, url, and folder fields.
 * @param {object} bookmark
 * @param {string} query
 * @returns {boolean}
 */
function matchesQuery(bookmark, query) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(bookmark.title).includes(q) ||
    normalize(bookmark.url).includes(q) ||
    normalize(bookmark.folder).includes(q)
  );
}

/**
 * Scores a bookmark by how many fields contain the query.
 * Higher score = better match.
 * @param {object} bookmark
 * @param {string} query
 * @returns {number}
 */
function scoreBookmark(bookmark, query) {
  const q = normalize(query);
  if (!q) return 0;
  let score = 0;
  if (normalize(bookmark.title).includes(q)) score += 3;
  if (normalize(bookmark.url).includes(q)) score += 2;
  if (normalize(bookmark.folder).includes(q)) score += 1;
  return score;
}

/**
 * Searches bookmarks by query string, returning results sorted by relevance.
 * @param {object[]} bookmarks
 * @param {string} query
 * @returns {object[]}
 */
function searchBookmarks(bookmarks, query) {
  if (!query || !query.trim()) return [...bookmarks];
  return bookmarks
    .filter((b) => matchesQuery(b, query))
    .map((b) => ({ bookmark: b, score: scoreBookmark(b, query) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.bookmark);
}

/**
 * Searches bookmarks and returns only the top N results.
 * @param {object[]} bookmarks
 * @param {string} query
 * @param {number} limit
 * @returns {object[]}
 */
function searchTop(bookmarks, query, limit = 10) {
  return searchBookmarks(bookmarks, query).slice(0, limit);
}

module.exports = { normalize, matchesQuery, scoreBookmark, searchBookmarks, searchTop };
