/**
 * bookmarkSnapshot.js
 * Save and restore point-in-time snapshots of bookmark collections.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SNAPSHOT_DIR = '.tabmerge-snapshots';

function resolveSnapshotDir(dir = DEFAULT_SNAPSHOT_DIR) {
  return path.resolve(process.cwd(), dir);
}

function buildSnapshotFilename(label) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const safe = label ? `_${label.replace(/[^a-zA-Z0-9-]/g, '_')}` : '';
  return `snapshot_${ts}${safe}.json`;
}

function saveSnapshot(bookmarks, { label, dir } = {}) {
  const snapshotDir = resolveSnapshotDir(dir);
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  const filename = buildSnapshotFilename(label);
  const filepath = path.join(snapshotDir, filename);
  const payload = {
    createdAt: new Date().toISOString(),
    label: label || null,
    count: bookmarks.length,
    bookmarks,
  };
  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2), 'utf8');
  return filepath;
}

function listSnapshots(dir) {
  const snapshotDir = resolveSnapshotDir(dir);
  if (!fs.existsSync(snapshotDir)) return [];
  return fs
    .readdirSync(snapshotDir)
    .filter((f) => f.startsWith('snapshot_') && f.endsWith('.json'))
    .map((f) => {
      const filepath = path.join(snapshotDir, f);
      const raw = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      return { filename: f, filepath, createdAt: raw.createdAt, label: raw.label, count: raw.count };
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function loadSnapshot(filenameOrPath, dir) {
  const snapshotDir = resolveSnapshotDir(dir);
  const filepath = path.isAbsolute(filenameOrPath)
    ? filenameOrPath
    : path.join(snapshotDir, filenameOrPath);
  if (!fs.existsSync(filepath)) {
    throw new Error(`Snapshot not found: ${filepath}`);
  }
  const raw = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  return raw.bookmarks;
}

function pruneSnapshots(keep = 5, dir) {
  const snapshots = listSnapshots(dir);
  const toDelete = snapshots.slice(0, Math.max(0, snapshots.length - keep));
  toDelete.forEach((s) => fs.unlinkSync(s.filepath));
  return toDelete.map((s) => s.filename);
}

module.exports = { resolveSnapshotDir, buildSnapshotFilename, saveSnapshot, listSnapshots, loadSnapshot, pruneSnapshots };
