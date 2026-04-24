/**
 * bookmarkDiff.js
 * Compare two sets of bookmarks and report additions, removals, and changes.
 */

'use strict';

const { normalizeUrl } = require('./deduplicator');

/**
 * Build a map of normalizedUrl -> bookmark for fast lookup.
 */
function buildUrlMap(bookmarks) {
  const map = new Map();
  for (const bm of bookmarks) {
    const key = normalizeUrl(bm.url);
    map.set(key, bm);
  }
  return map;
}

/**
 * Return bookmarks present in `next` but not in `prev` (by URL).
 */
function findAdded(prev, next) {
  const prevMap = buildUrlMap(prev);
  return next.filter(bm => !prevMap.has(normalizeUrl(bm.url)));
}

/**
 * Return bookmarks present in `prev` but not in `next` (by URL).
 */
function findRemoved(prev, next) {
  const nextMap = buildUrlMap(next);
  return prev.filter(bm => !nextMap.has(normalizeUrl(bm.url)));
}

/**
 * Return bookmarks whose title or folder changed between prev and next.
 */
function findChanged(prev, next) {
  const prevMap = buildUrlMap(prev);
  const changed = [];
  for (const bm of next) {
    const key = normalizeUrl(bm.url);
    const old = prevMap.get(key);
    if (!old) continue;
    if (old.title !== bm.title || old.folder !== bm.folder) {
      changed.push({ before: old, after: bm });
    }
  }
  return changed;
}

/**
 * Compute a full diff between two bookmark arrays.
 */
function diffBookmarks(prev, next) {
  return {
    added: findAdded(prev, next),
    removed: findRemoved(prev, next),
    changed: findChanged(prev, next),
  };
}

/**
 * Format a diff result as a human-readable string.
 */
function formatDiff(diff) {
  const lines = [];
  lines.push(`Added   : ${diff.added.length}`);
  for (const bm of diff.added) lines.push(`  + [${bm.folder || 'root'}] ${bm.title} <${bm.url}>`);
  lines.push(`Removed : ${diff.removed.length}`);
  for (const bm of diff.removed) lines.push(`  - [${bm.folder || 'root'}] ${bm.title} <${bm.url}>`);
  lines.push(`Changed : ${diff.changed.length}`);
  for (const { before, after } of diff.changed) {
    lines.push(`  ~ ${before.title} => ${after.title} | folder: ${before.folder} => ${after.folder}`);
  }
  return lines.join('\n');
}

module.exports = { buildUrlMap, findAdded, findRemoved, findChanged, diffBookmarks, formatDiff };
