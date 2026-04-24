# bookmarkDiff

Compare two sets of bookmarks to identify what was added, removed, or modified.

## Functions

### `diffBookmarks(prev, next)`

Returns a diff object with three arrays:

| Key       | Description                                              |
|-----------|----------------------------------------------------------|
| `added`   | Bookmarks present in `next` but not in `prev`            |
| `removed` | Bookmarks present in `prev` but not in `next`            |
| `changed` | Bookmarks whose `title` or `folder` changed              |

URL comparison is normalized (trailing slashes, protocol casing, etc.) via `normalizeUrl`.

### `formatDiff(diff)`

Formats the diff result as a human-readable multi-line string.

```
Added   : 2
  + [Work] New Site <https://newsite.com/>
Removed : 1
  - [Personal] Old Blog <https://oldblog.com/>
Changed : 1
  ~ Old Title => New Title | folder: Work => Archive
```

## Usage

```js
const { diffBookmarks, formatDiff } = require('./bookmarkDiff');

const prev = await importBookmarks(['old.html']);
const next = await importBookmarks(['new.html']);

const diff = diffBookmarks(prev, next);
console.log(formatDiff(diff));
```

## Integration

This module is used by the CLI `--diff` flag to compare a previous export snapshot against the current merge result.
