# bookmarkPinned

Manage a persistent list of pinned (starred) bookmarks.

## Functions

### `pinBookmark(bookmark, filePath?)`
Adds a bookmark's URL to the pinned list. Duplicate pins are silently ignored.

### `unpinBookmark(url, filePath?)`
Removes a URL from the pinned list.

### `isPinned(url, filePath?)`
Returns `true` if the given URL is currently pinned.

### `filterPinned(bookmarks, filePath?)`
Returns only the bookmarks whose URLs are in the pinned list.

### `annotatePinned(bookmarks, filePath?)`
Returns a new array of bookmarks with a `pinned: true/false` field added to each.

### `loadPinned(filePath?)` / `savePinned(urls, filePath?)`
Low-level helpers to read and write the pinned URL list from a JSON file.

## Storage

Pinned URLs are stored in `.tabmerge-pinned.json` by default (in the current working directory). Pass a custom path to any function to override.

## Example

```js
const { pinBookmark, filterPinned } = require('./bookmarkPinned');

pinBookmark({ url: 'https://example.com', title: 'Example' });

const myBookmarks = [ /* ... */ ];
const starred = filterPinned(myBookmarks);
console.log(starred);
```
