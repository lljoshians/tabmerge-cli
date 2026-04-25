/**
 * bookmarkColorTag.js
 * Assign and manage color tags on bookmarks for visual organization.
 */

const VALID_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];

/**
 * Assign a color tag to a single bookmark.
 * @param {object} bookmark
 * @param {string} color
 * @returns {object}
 */
function setColor(bookmark, color) {
  if (!VALID_COLORS.includes(color)) {
    throw new Error(`Invalid color "${color}". Valid: ${VALID_COLORS.join(', ')}`);
  }
  return { ...bookmark, color };
}

/**
 * Remove the color tag from a bookmark.
 * @param {object} bookmark
 * @returns {object}
 */
function clearColor(bookmark) {
  const copy = { ...bookmark };
  delete copy.color;
  return copy;
}

/**
 * Apply a color to all bookmarks matching a predicate.
 * @param {object[]} bookmarks
 * @param {function} predicate
 * @param {string} color
 * @returns {object[]}
 */
function colorWhere(bookmarks, predicate, color) {
  return bookmarks.map(b => predicate(b) ? setColor(b, color) : b);
}

/**
 * Filter bookmarks by a specific color.
 * @param {object[]} bookmarks
 * @param {string} color
 * @returns {object[]}
 */
function getByColor(bookmarks, color) {
  return bookmarks.filter(b => b.color === color);
}

/**
 * Return a frequency map of color usage.
 * @param {object[]} bookmarks
 * @returns {object}
 */
function colorFrequency(bookmarks) {
  return bookmarks.reduce((acc, b) => {
    if (b.color) {
      acc[b.color] = (acc[b.color] || 0) + 1;
    }
    return acc;
  }, {});
}

module.exports = { VALID_COLORS, setColor, clearColor, colorWhere, getByColor, colorFrequency };
