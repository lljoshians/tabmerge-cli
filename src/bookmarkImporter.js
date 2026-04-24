/**
 * bookmarkImporter.js
 * Handles importing bookmarks from multiple file paths,
 * resolving globs, and aggregating parsed results.
 */

const fs = require('fs');
const path = require('path');
const { parseBookmarkFile } = require('./parser');

/**
 * Expand a list of paths that may include simple wildcards (*.html).
 * Only supports single-level glob with * in the filename.
 * @param {string[]} patterns
 * @returns {string[]}
 */
function resolveInputPaths(patterns) {
  const resolved = [];
  for (const pattern of patterns) {
    if (pattern.includes('*')) {
      const dir = path.dirname(pattern);
      const base = path.basename(pattern).replace(/\./g, '\\.').replace(/\*/g, '.*');
      const regex = new RegExp(`^${base}$`);
      const entries = fs.readdirSync(dir).filter(f => regex.test(f));
      entries.forEach(f => resolved.push(path.join(dir, f)));
    } else {
      resolved.push(pattern);
    }
  }
  return resolved;
}

/**
 * Import bookmarks from one or more file paths.
 * Returns an object with all bookmarks and per-file metadata.
 * @param {string[]} filePaths
 * @returns {{ bookmarks: object[], sources: object[] }}
 */
function importBookmarks(filePaths) {
  const sources = [];
  const allBookmarks = [];

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const bookmarks = parseBookmarkFile(filePath);
    sources.push({ file: filePath, count: bookmarks.length });
    allBookmarks.push(...bookmarks);
  }

  return { bookmarks: allBookmarks, sources };
}

/**
 * Import from patterns, resolving globs first.
 * @param {string[]} patterns
 * @returns {{ bookmarks: object[], sources: object[] }}
 */
function importFromPatterns(patterns) {
  const paths = resolveInputPaths(patterns);
  if (paths.length === 0) {
    throw new Error('No input files matched the provided patterns.');
  }
  return importBookmarks(paths);
}

module.exports = { resolveInputPaths, importBookmarks, importFromPatterns };
