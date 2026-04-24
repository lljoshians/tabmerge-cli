/**
 * bookmarkLabeler.js
 * Assign, remove, and query custom labels on bookmarks.
 */

/**
 * Add a label to a bookmark (no duplicates).
 * @param {object} bookmark
 * @param {string} label
 * @returns {object} updated bookmark
 */
function addLabel(bookmark, label) {
  const labels = Array.isArray(bookmark.labels) ? bookmark.labels : [];
  if (!labels.includes(label)) {
    return { ...bookmark, labels: [...labels, label] };
  }
  return bookmark;
}

/**
 * Remove a label from a bookmark.
 * @param {object} bookmark
 * @param {string} label
 * @returns {object} updated bookmark
 */
function removeLabel(bookmark, label) {
  const labels = Array.isArray(bookmark.labels) ? bookmark.labels : [];
  return { ...bookmark, labels: labels.filter((l) => l !== label) };
}

/**
 * Apply a label to all bookmarks matching a predicate.
 * @param {object[]} bookmarks
 * @param {function} predicate
 * @param {string} label
 * @returns {object[]}
 */
function labelWhere(bookmarks, predicate, label) {
  return bookmarks.map((b) => (predicate(b) ? addLabel(b, label) : b));
}

/**
 * Return all bookmarks that carry a given label.
 * @param {object[]} bookmarks
 * @param {string} label
 * @returns {object[]}
 */
function getByLabel(bookmarks, label) {
  return bookmarks.filter(
    (b) => Array.isArray(b.labels) && b.labels.includes(label)
  );
}

/**
 * Build a frequency map of all labels across the collection.
 * @param {object[]} bookmarks
 * @returns {object} { label: count }
 */
function labelFrequency(bookmarks) {
  const freq = {};
  for (const b of bookmarks) {
    if (Array.isArray(b.labels)) {
      for (const l of b.labels) {
        freq[l] = (freq[l] || 0) + 1;
      }
    }
  }
  return freq;
}

module.exports = { addLabel, removeLabel, labelWhere, getByLabel, labelFrequency };
