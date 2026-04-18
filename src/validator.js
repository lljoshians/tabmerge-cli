/**
 * Validates bookmark objects for required fields and correct types.
 */

const VALID_SCHEMES = ['http:', 'https:', 'ftp:', 'file:'];

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return VALID_SCHEMES.includes(parsed.protocol);
  } catch {
    return false;
  }
}

function validateBookmark(bookmark) {
  const errors = [];

  if (!bookmark || typeof bookmark !== 'object') {
    return ['Bookmark must be an object'];
  }

  if (!bookmark.url || typeof bookmark.url !== 'string') {
    errors.push('Missing or invalid field: url');
  } else if (!isValidUrl(bookmark.url)) {
    errors.push(`Invalid URL scheme: ${bookmark.url}`);
  }

  if (!bookmark.title || typeof bookmark.title !== 'string') {
    errors.push('Missing or invalid field: title');
  }

  if (bookmark.addDate !== undefined && typeof bookmark.addDate !== 'number') {
    errors.push('Field addDate must be a number');
  }

  if (bookmark.folder !== undefined && typeof bookmark.folder !== 'string') {
    errors.push('Field folder must be a string');
  }

  return errors;
}

function validateAll(bookmarks) {
  if (!Array.isArray(bookmarks)) {
    return { valid: false, errors: ['Input must be an array'], invalidCount: 0 };
  }

  const errors = [];
  let invalidCount = 0;

  bookmarks.forEach((bookmark, index) => {
    const errs = validateBookmark(bookmark);
    if (errs.length > 0) {
      invalidCount++;
      errs.forEach(e => errors.push(`[${index}] ${e}`));
    }
  });

  return {
    valid: invalidCount === 0,
    errors,
    invalidCount,
  };
}

module.exports = { validateBookmark, validateAll, isValidUrl };
