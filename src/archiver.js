/**
 * archiver.js
 * Handles snapshotting and archiving of merged bookmark sets
 * with timestamped output and optional compression metadata.
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate a timestamped archive filename.
 * @param {string} baseName - base name without extension
 * @param {string} ext - file extension (e.g. 'json', 'html')
 * @returns {string}
 */
function buildArchiveFilename(baseName, ext) {
  const now = new Date();
  const ts = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  return `${baseName}_${ts}.${ext}`;
}

/**
 * Write an archive snapshot to the given directory.
 * @param {string} content - serialized bookmark content
 * @param {string} dir - target directory
 * @param {string} baseName - base filename
 * @param {string} ext - file extension
 * @returns {{ filePath: string, sizeBytes: number }}
 */
function writeArchive(content, dir, baseName = 'bookmarks_archive', ext = 'json') {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filename = buildArchiveFilename(baseName, ext);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  const sizeBytes = Buffer.byteLength(content, 'utf8');
  return { filePath, sizeBytes };
}

/**
 * List all archive snapshots in a directory, sorted newest first.
 * @param {string} dir
 * @param {string} baseName
 * @returns {string[]}
 */
function listArchives(dir, baseName = 'bookmarks_archive') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.startsWith(baseName))
    .sort()
    .reverse();
}

/**
 * Prune old archives, keeping only the N most recent.
 * @param {string} dir
 * @param {string} baseName
 * @param {number} keep
 * @returns {string[]} list of deleted filenames
 */
function pruneArchives(dir, baseName = 'bookmarks_archive', keep = 5) {
  const archives = listArchives(dir, baseName);
  const toDelete = archives.slice(keep);
  toDelete.forEach(f => fs.unlinkSync(path.join(dir, f)));
  return toDelete;
}

module.exports = { buildArchiveFilename, writeArchive, listArchives, pruneArchives };
