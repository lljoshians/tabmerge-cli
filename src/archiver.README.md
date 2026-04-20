# archiver

Provides snapshot/archiving functionality for merged bookmark output files.

## Functions

### `buildArchiveFilename(baseName, ext)`
Generates a timestamped filename like `bookmarks_archive_2024-06-01_14-30-00.json`.

### `writeArchive(content, dir, baseName?, ext?)`
Writes serialized bookmark content to a timestamped file inside `dir`.
Creates the directory recursively if it does not exist.
Returns `{ filePath, sizeBytes }`.

### `listArchives(dir, baseName?)`
Returns all archive filenames in `dir` matching `baseName`, sorted newest first.

### `pruneArchives(dir, baseName?, keep?)`
Deletes the oldest archive files beyond the `keep` limit (default: 5).
Returns the list of deleted filenames.

## Usage

```js
const { writeArchive, pruneArchives } = require('./archiver');

// Save a snapshot
const { filePath } = writeArchive(jsonContent, './archives');
console.log('Saved to', filePath);

// Keep only the 3 most recent
pruneArchives('./archives', 'bookmarks_archive', 3);
```

## Integration

Call `writeArchive` from `pipeline.js` after the export step when the
`--archive` CLI flag is set. Use `pruneArchives` to avoid unbounded growth
of the archive directory.
