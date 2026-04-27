/**
 * bookmarkTimeline.js
 * Group bookmarks into time-based buckets for timeline visualization.
 */

/**
 * Format a Date into a YYYY-MM string (month bucket).
 * @param {Date} date
 * @returns {string}
 */
function toMonthKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Format a Date into a YYYY string (year bucket).
 * @param {Date} date
 * @returns {string}
 */
function toYearKey(date) {
  return String(new Date(date).getFullYear());
}

/**
 * Group bookmarks by month bucket.
 * Bookmarks without an addDate are placed under "unknown".
 * @param {object[]} bookmarks
 * @returns {Object.<string, object[]>}
 */
function groupByMonth(bookmarks) {
  const result = {};
  for (const bm of bookmarks) {
    const key = bm.addDate ? toMonthKey(bm.addDate) : 'unknown';
    if (!result[key]) result[key] = [];
    result[key].push(bm);
  }
  return result;
}

/**
 * Group bookmarks by year bucket.
 * @param {object[]} bookmarks
 * @returns {Object.<string, object[]>}
 */
function groupByYear(bookmarks) {
  const result = {};
  for (const bm of bookmarks) {
    const key = bm.addDate ? toYearKey(bm.addDate) : 'unknown';
    if (!result[key]) result[key] = [];
    result[key].push(bm);
  }
  return result;
}

/**
 * Build a sorted timeline array from a bucket map.
 * @param {Object.<string, object[]>} buckets
 * @returns {{ period: string, count: number, bookmarks: object[] }[]}
 */
function buildTimeline(buckets) {
  return Object.keys(buckets)
    .sort((a, b) => (a === 'unknown' ? 1 : b === 'unknown' ? -1 : a.localeCompare(b)))
    .map(period => ({ period, count: buckets[period].length, bookmarks: buckets[period] }));
}

/**
 * Generate a timeline from bookmarks using the given granularity.
 * @param {object[]} bookmarks
 * @param {'month'|'year'} granularity
 * @returns {{ period: string, count: number, bookmarks: object[] }[]}
 */
function generateTimeline(bookmarks, granularity = 'month') {
  const buckets = granularity === 'year' ? groupByYear(bookmarks) : groupByMonth(bookmarks);
  return buildTimeline(buckets);
}

module.exports = { toMonthKey, toYearKey, groupByMonth, groupByYear, buildTimeline, generateTimeline };
