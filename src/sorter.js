/**
 * Sort bookmarks by various criteria
 */

/**
 * Sort bookmarks by title (alphabetical)
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByTitle(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) =>
    (a.title || '').localeCompare(b.title || '')
  );
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort bookmarks by date added
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByDate(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) => {
    const da = a.addDate ? new Date(a.addDate) : new Date(0);
    const db = b.addDate ? new Date(b.addDate) : new Date(0);
    return da - db;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort bookmarks by folder name
 * @param {Array} bookmarks
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
function sortByFolder(bookmarks, order = 'asc') {
  const sorted = [...bookmarks].sort((a, b) =>
    (a.folder || '').localeCompare(b.folder || '')
  );
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Apply sorting based on options
 * @param {Array} bookmarks
 * @param {{ by: string, order: string }} options
 * @returns {Array}
 */
function applySort(bookmarks, options = {}) {
  const { by = 'title', order = 'asc' } = options;
  switch (by) {
    case 'date':
      return sortByDate(bookmarks, order);
    case 'folder':
      return sortByFolder(bookmarks, order);
    case 'title':
    default:
      return sortByTitle(bookmarks, order);
  }
}

module.exports = { sortByTitle, sortByDate, sortByFolder, applySort };
