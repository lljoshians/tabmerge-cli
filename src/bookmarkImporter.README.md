# bookmarkImporter

Handles importing bookmarks from one or more file paths, including basic glob pattern support.

## API

### `resolveInputPaths(patterns: string[]): string[]`

Expands a list of file path patterns into concrete file paths. Supports simple `*` wildcards in filenames (e.g., `./exports/*.html`).

```js
const paths = resolveInputPaths(['./bookmarks/*.html', './extra.html']);
// => ['./bookmarks/chrome.html', './bookmarks/firefox.html', './extra.html']
```

### `importBookmarks(filePaths: string[]): { bookmarks, sources }`

Parses each file using `parseBookmarkFile` and aggregates results.

- `bookmarks` — flat array of all bookmark objects
- `sources` — array of `{ file, count }` metadata per input file

Throws if any file does not exist.

### `importFromPatterns(patterns: string[]): { bookmarks, sources }`

Combines `resolveInputPaths` and `importBookmarks`. Throws if no files match the provided patterns.

```js
const { bookmarks, sources } = importFromPatterns(['./exports/*.html']);
console.log(`Imported ${bookmarks.length} bookmarks from ${sources.length} file(s).`);
```

## Integration

This module is used by `pipeline.js` as the first stage of the processing pipeline, feeding resolved bookmarks into the merger, deduplicator, and exporter.
