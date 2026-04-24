# bookmarkAnnotator

Add, update, and remove user-defined notes/annotations on bookmarks.

## API

### `annotateBookmark(bookmark, note)`

Returns a new bookmark object with the `annotation` field set to `note` (trimmed).

```js
const { annotateBookmark } = require('./bookmarkAnnotator');
const bm = annotateBookmark({ url: 'https://example.com', title: 'Example' }, 'great resource');
// { url: 'https://example.com', title: 'Example', annotation: 'great resource' }
```

### `removeAnnotation(bookmark)`

Returns a new bookmark with the `annotation` field removed.

### `annotateWhere(bookmarks, predicate, note)`

Applies an annotation to all bookmarks where `predicate(bookmark)` returns `true`.

```js
const results = annotateWhere(bookmarks, b => b.folder === 'Work', 'work related');
```

### `getAnnotated(bookmarks)`

Filters and returns only bookmarks that have a non-empty annotation.

```js
const annotated = getAnnotated(bookmarks);
```

### `buildAnnotationMap(bookmarks)`

Returns a plain object mapping `url -> annotation` for all annotated bookmarks. Useful for quick lookup.

```js
const map = buildAnnotationMap(bookmarks);
console.log(map['https://github.com']); // 'code host'
```

## Notes

- All functions are pure — they do not mutate input bookmarks.
- Annotations are stored as the `annotation` property on each bookmark object.
- Compatible with the JSON export format produced by `formatter.js`.
