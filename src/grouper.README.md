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
Throws a `TypeError` if an unrecognised strategy string is passed.

### `getGroupKeys(grouped)`
Returns a sorted array of group keys from a grouped bookmarks object.
Useful for rendering group headings in a consistent order.

```js
getGroupKeys({ 'mozilla.org': [...], 'github.com': [...] });
// => ['github.com', 'mozilla.org']
```

## Usage

```js
const { applyGrouping, getGroupKeys } = require('./grouper');

const grouped = applyGrouping(bookmarks, 'domain');
// { 'github.com': [...], 'mozilla.org': [...], ... }

const keys = getGroupKeys(grouped);
// ['github.com', 'mozilla.org']
```

## Integration

Used by `formatter.js` for HTML/JSON output and by `preview.js` for
terminal preview rendering.
