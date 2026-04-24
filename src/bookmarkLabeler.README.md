# bookmarkLabeler

Assign, remove, and query custom **labels** on bookmark objects.
Labels are free-form strings stored in a `labels` array on each bookmark.

## API

### `addLabel(bookmark, label) → bookmark`
Returns a new bookmark with `label` added (no duplicates).

### `removeLabel(bookmark, label) → bookmark`
Returns a new bookmark with `label` removed.

### `labelWhere(bookmarks, predicate, label) → bookmarks`
Applies `label` to every bookmark for which `predicate(bookmark)` returns `true`.

### `getByLabel(bookmarks, label) → bookmarks`
Filters the collection to bookmarks that carry `label`.

### `labelFrequency(bookmarks) → { [label]: count }`
Builds a frequency map of all labels in the collection.

## CLI

```bash
# Add a label to every bookmark whose title/url contains "github"
node src/bookmarkLabeler.cli.js add bookmarks.json dev --where github

# Remove a label from all bookmarks
node src/bookmarkLabeler.cli.js remove bookmarks.json dev

# List bookmarks that carry a label
node src/bookmarkLabeler.cli.js list bookmarks.json dev

# Show label frequency table
node src/bookmarkLabeler.cli.js freq bookmarks.json
```

## Bookmark shape

```json
{
  "url": "https://example.com",
  "title": "Example",
  "labels": ["work", "read-later"]
}
```

All functions are **pure** — they never mutate the original bookmark objects.
