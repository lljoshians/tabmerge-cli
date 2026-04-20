# grouper.js

Provides flexible bookmark grouping strategies used during export and preview.

## Functions

### `groupByFolder(bookmarks)`
Groups an array of bookmark objects by their `folder` property.
Bookmarks without a folder are placed under `"Uncategorized"`.

### `groupByDomain(bookmarks)`
Groups bookmarks by the hostname of their URL, stripping a leading `www.`.
Bookmarks with unparseable URLs are placed under `"unknown"`.

### `groupByDate(bookmarks)`
Groups bookmarks by the calendar date (`YYYY-MM-DD`) derived from `addDate`.
Supports both Unix timestamps (numbers) and date strings.
Bookmarks with no or invalid date are placed under `"unknown"`.

### `applyGrouping(bookmarks, strategy)`
Dispatch helper. Accepts `'folder'` (default), `'domain'`, or `'date'`.

## Usage

```js
const { applyGrouping } = require('./grouper');

const grouped = applyGrouping(bookmarks, 'domain');
// { 'github.com': [...], 'mozilla.org': [...], ... }
```

## Integration

Used by `formatter.js` for HTML/JSON output and by `preview.js` for
terminal preview rendering.
