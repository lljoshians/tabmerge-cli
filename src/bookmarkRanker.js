/**
 * bookmarkRanker.js
 * Ranks bookmarks by a composite score based on recency, title length, and domain popularity.
 */

/**
 * Score a bookmark by recency (newer = higher score).
 * @param {Object} bookmark
 * @param {number} now - timestamp in ms
 * @returns {number} 0–1
 */
function recencyScore(bookmark, now = Date.now()) {
  if (!bookmark.addDate) return 0;
  const age = now - bookmark.addDate * 1000;
  const maxAge = 1000 * 60 * 60 * 24 * 365 * 5; // 5 years
  return Math.max(0, 1 - age / maxAge);
}

/**
 * Score a bookmark by title quality (penalise very short or very long titles).
 * @param {Object} bookmark
 * @returns {number} 0–1
 */
function titleScore(bookmark) {
  const title = (bookmark.title || '').trim();
  if (!title) return 0;
  const len = title.length;
  if (len >= 10 && len <= 80) return 1;
  if (len < 10) return len / 10;
  return Math.max(0, 1 - (len - 80) / 120);
}

/**
 * Score a bookmark by domain frequency within the full list.
 * @param {Object} bookmark
 * @param {Map<string, number>} domainCounts
 * @param {number} maxCount
 * @returns {number} 0–1
 */
function domainPopularityScore(bookmark, domainCounts, maxCount) {
  if (!bookmark.url || maxCount === 0) return 0;
  try {
    const domain = new URL(bookmark.url).hostname;
    return (domainCounts.get(domain) || 0) / maxCount;
  } catch {
    return 0;
  }
}

/**
 * Build a map of domain -> count from a list of bookmarks.
 * @param {Object[]} bookmarks
 * @returns {Map<string, number>}
 */
function buildDomainCounts(bookmarks) {
  const counts = new Map();
  for (const b of bookmarks) {
    try {
      const domain = new URL(b.url).hostname;
      counts.set(domain, (counts.get(domain) || 0) + 1);
    } catch {
      // skip invalid URLs
    }
  }
  return counts;
}

/**
 * Rank bookmarks by composite score.
 * @param {Object[]} bookmarks
 * @param {{ recency?: number, title?: number, domain?: number }} weights
 * @returns {Array<{ bookmark: Object, score: number }>}
 */
function rankBookmarks(bookmarks, weights = {}) {
  const w = {
    recency: weights.recency ?? 0.5,
    title: weights.title ?? 0.3,
    domain: weights.domain ?? 0.2,
  };

  const domainCounts = buildDomainCounts(bookmarks);
  const maxCount = Math.max(0, ...domainCounts.values());
  const now = Date.now();

  return bookmarks
    .map((bookmark) => {
      const score =
        w.recency * recencyScore(bookmark, now) +
        w.title * titleScore(bookmark) +
        w.domain * domainPopularityScore(bookmark, domainCounts, maxCount);
      return { bookmark, score: Math.round(score * 1000) / 1000 };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  recencyScore,
  titleScore,
  domainPopularityScore,
  buildDomainCounts,
  rankBookmarks,
};
