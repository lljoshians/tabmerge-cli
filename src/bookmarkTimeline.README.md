# bookmarkTimeline

Groups bookmarks into time-based buckets for timeline visualization or analysis.

## Functions

### `generateTimeline(bookmarks, granularity?)`

Main entry point. Returns a sorted array of timeline entries.

- `bookmarks` — array of bookmark objects with optional `addDate` field
- `granularity` — `'month'` (default) or `'year'`

Returns:
```js
[
  { period: '2023-01', count: 2, bookmarks: [ ... ] },
  { period: '2023-03', count: 1, bookmarks: [ ... ] },
  { period: 'unknown', count: 1, bookmarks: [ ... ] },
]
```

Bookmarks without an `addDate` are grouped under the `'unknown'` period, which always appears last.

### `groupByMonth(bookmarks)`

Returns a plain object mapping `YYYY-MM` keys to bookmark arrays.

### `groupByYear(bookmarks)`

Returns a plain object mapping `YYYY` keys to bookmark arrays.

### `buildTimeline(buckets)`

Converts a bucket map into a sorted timeline array.

## Example

```js
const { generateTimeline } = require('./bookmarkTimeline');

const timeline = generateTimeline(bookmarks, 'year');
timeline.forEach(({ period, count }) => {
  console.log(`${period}: ${count} bookmark(s)`);
});
```
