# bookmarkSnapshot

Save and restore named snapshots of bookmark collections at any point in time.

## API

### `saveSnapshot(bookmarks, options?)`
Writes bookmarks to a timestamped JSON file in the snapshot directory.

**Options:**
- `label` — optional human-readable tag embedded in the filename
- `dir` — snapshot directory (default: `.tabmerge-snapshots`)

Returns the absolute path of the written file.

### `listSnapshots(dir?)`
Returns an array of snapshot metadata objects sorted oldest-first:
```js
[{ filename, filepath, createdAt, label, count }]
```

### `loadSnapshot(filenameOrPath, dir?)`
Reads a snapshot file by filename (relative to snapshot dir) or absolute path.
Returns the `bookmarks` array.

### `pruneSnapshots(keep?, dir?)`
Deletes the oldest snapshots, keeping only the `keep` most recent (default: 5).
Returns an array of deleted filenames.

## Example

```js
const { saveSnapshot, listSnapshots, loadSnapshot, pruneSnapshots } = require('./bookmarkSnapshot');

// Save before a big merge
const snap = saveSnapshot(bookmarks, { label: 'before-merge' });
console.log('Saved:', snap);

// List all snapshots
const all = listSnapshots();
console.log(all.map(s => `${s.createdAt} — ${s.label} (${s.count} bookmarks)`));

// Restore
const restored = loadSnapshot(all[0].filepath);

// Keep only the 3 most recent
pruneSnapshots(3);
```

## Snapshot file format

```json
{
  "createdAt": "2024-06-01T12:00:00.000Z",
  "label": "before-merge",
  "count": 42,
  "bookmarks": [ ... ]
}
```
