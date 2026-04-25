/**
 * bookmarkMergePolicy.js
 * Defines and applies merge policies when combining duplicate bookmarks
 * across multiple imported files.
 */

'use strict';

/**
 * Keep the oldest bookmark (by addDate) among duplicates.
 * Bookmarks without an addDate are treated as infinitely old (Infinity),
 * so they lose to any bookmark that has a date.
 */
function keepOldest(bookmarks) {
  return bookmarks.reduce((best, bm) => {
    const bestDate = best.addDate || Infinity;
    const bmDate = bm.addDate || Infinity;
    return bmDate < bestDate ? bm : best;
  });
}

/**
 * Keep the newest bookmark (by addDate) among duplicates.
 * Bookmarks without an addDate are treated as epoch (0),
 * so they lose to any bookmark that has a date.
 */
function keepNewest(bookmarks) {
  return bookmarks.reduce((best, bm) => {
    const bestDate = best.addDate || 0;
    const bmDate = bm.addDate || 0;
    return bmDate > bestDate ? bm : best;
  });
}

/**
 * Merge fields from all duplicates into a single bookmark.
 * Tags are unioned; title and folder come from the newest entry.
 */
function mergeFields(bookmarks) {
  const base = keepNewest(bookmarks);
  const allTags = bookmarks.flatMap(bm => bm.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return { ...base, tags: uniqueTags };
}

/**
 * Keep the bookmark with the longest / most descriptive title.
 */
function keepRichest(bookmarks) {
  return bookmarks.reduce((best, bm) => {
    const bestLen = (best.title || '').length;
    const bmLen = (bm.title || '').length;
    return bmLen > bestLen ? bm : best;
  });
}

const POLICIES = {
  oldest: keepOldest,
  newest: keepNewest,
  merge: mergeFields,
  richest: keepRichest,
};

/**
 * Apply a named policy to groups of duplicate bookmarks.
 * @param {Object[]} bookmarks
 * @param {string} policyName - 'oldest' | 'newest' | 'merge' | 'richest'
 * @returns {Object[]}
 */
function applyMergePolicy(bookmarks, policyName = 'newest') {
  if (!Array.isArray(bookmarks)) {
    throw new TypeError(`Expected bookmarks to be an array, got ${typeof bookmarks}`);
  }

  const policy = POLICIES[policyName];
  if (!policy) {
    throw new Error(`Unknown merge policy: "${policyName}". Valid options: ${Object.keys(POLICIES).join(', ')}`);
  }

  const groups = new Map();
  for (const bm of bookmarks) {
    const key = (bm.url || '').toLowerCase().trim();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(bm);
  }

  const result = [];
  for (const group of groups.values()) {
    result.push(group.length === 1 ? group[0] : policy(group));
  }
  return result;
}

module.exports = { keepOldest, keepNewest, mergeFields, keepRichest, applyMergePolicy };
