# bookmarkSearch

Full-text search across bookmark collections with relevance scoring.

## Functions

### `searchBookmarks(bookmarks, query)`

Filters and sorts bookmarks by relevance to the given query string.

- Searches `title`, `url`, and `folder` fields (case-insensitive).
- Returns bookmarks sorted by match score (highest first).
- Returns all bookmarks when `query` is empty.

```js
const { searchBookmarks } = require('./bookmarkSearch');

const results = searchBookmarks(bookmarks, 'github');
// [ { title: 'GitHub', url: 'https://github.com', folder: 'Dev' } ]
```

### `searchTop(bookmarks, query, limit = 10)`

Same as `searchBookmarks` but returns only the top `limit` results.

```js
const top5 = searchTop(bookmarks, 'dev', 5);
```

### `scoreBookmark(bookmark, query)`

Returns a numeric relevance score for a bookmark against a query:

| Field    | Score |
|----------|-------|
| `title`  | +3    |
| `url`    | +2    |
| `folder` | +1    |

### `matchesQuery(bookmark, query)`

Returns `true` if the bookmark matches the query in any field.

## Integration

Use `searchBookmarks` inside the pipeline or CLI to add `--search <query>` support:

```js
const { searchBookmarks } = require('./bookmarkSearch');

// inside pipeline or CLI run()
if (args.search) {
  bookmarks = searchBookmarks(bookmarks, args.search);
}
```
