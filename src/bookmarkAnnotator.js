/**
 * bookmarkAnnotator.js
 * Add, update, and remove user-defined notes/annotations on bookmarks.
 */

/**
 * Add or update an annotation on a bookmark.
 * @param {object} bookmark
 * @param {string} note
 * @returns {object}
 */
function annotateBookmark(bookmark, note) {
  if (!bookmark || typeof bookmark !== 'object') {
    throw new Error('Invalid bookmark');
  }
  if (typeof note !== 'string') {
    throw new Error('Note must be a string');
  }
  return { ...bookmark, annotation: note.trim() };
}

/**
 * Remove annotation from a bookmark.
 * @param {object} bookmark
 * @returns {object}
 */
function removeAnnotation(bookmark) {
  if (!bookmark || typeof bookmark !== 'object') {
    throw new Error('Invalid bookmark');
  }
  const { annotation, ...rest } = bookmark;
  return rest;
}

/**
 * Annotate all bookmarks matching a predicate.
 * @param {object[]} bookmarks
 * @param {function} predicate
 * @param {string} note
 * @returns {object[]}
 */
function annotateWhere(bookmarks, predicate, note) {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks.map(b => (predicate(b) ? annotateBookmark(b, note) : b));
}

/**
 * Filter bookmarks that have an annotation.
 * @param {object[]} bookmarks
 * @returns {object[]}
 */
function getAnnotated(bookmarks) {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks.filter(b => typeof b.annotation === 'string' && b.annotation.length > 0);
}

/**
 * Build a map of url -> annotation for quick lookup.
 * @param {object[]} bookmarks
 * @returns {object}
 */
function buildAnnotationMap(bookmarks) {
  if (!Array.isArray(bookmarks)) return {};
  return bookmarks.reduce((acc, b) => {
    if (b.url && typeof b.annotation === 'string') {
      acc[b.url] = b.annotation;
    }
    return acc;
  }, {});
}

module.exports = {
  annotateBookmark,
  removeAnnotation,
  annotateWhere,
  getAnnotated,
  buildAnnotationMap,
};
