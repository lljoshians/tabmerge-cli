// tagger.js - assign and filter tags on bookmarks

/**
 * Extract tags from a bookmark's folder path or title hints.
 * e.g. "[work]" in title becomes a tag
 */
function extractTags(bookmark) {
  const tags = new Set(bookmark.tags || []);

  const tagPattern = /\[([\w-]+)\]/g;
  const source = `${bookmark.title || ''} ${bookmark.folder || ''}`;
  let match;
  while ((match = tagPattern.exec(source)) !== null) {
    tags.add(match[1].toLowerCase());
  }

  if (bookmark.folder) {
    tags.add(bookmark.folder.toLowerCase().replace(/\s+/g, '-'));
  }

  return Array.from(tags);
}

/**
 * Assign tags to a single bookmark, returning a new bookmark object.
 */
function tagBookmark(bookmark) {
  return {
    ...bookmark,
    tags: extractTags(bookmark),
  };
}

/**
 * Apply tagging to an array of bookmarks.
 */
function tagAll(bookmarks) {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks.map(tagBookmark);
}

/**
 * Filter bookmarks that include ALL of the given tags.
 */
function filterByTags(bookmarks, tags) {
  if (!tags || tags.length === 0) return bookmarks;
  const required = tags.map(t => t.toLowerCase());
  return bookmarks.filter(b => {
    const bTags = b.tags || [];
    return required.every(t => bTags.includes(t));
  });
}

/**
 * Return a map of tag -> count across all bookmarks.
 */
function tagFrequency(bookmarks) {
  const freq = {};
  for (const b of bookmarks) {
    for (const tag of b.tags || []) {
      freq[tag] = (freq[tag] || 0) + 1;
    }
  }
  return freq;
}

module.exports = { extractTags, tagBookmark, tagAll, filterByTags, tagFrequency };
