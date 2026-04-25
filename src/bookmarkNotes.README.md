# bookmarkNotes

Attach, persist, and query freeform text notes on individual bookmarks.

## Functions

### `addNote(bookmarks, url, text, notesPath?)`
Attaches a note to the bookmark matching `url`. Persists to the notes file and returns an updated bookmarks array.

### `removeNote(bookmarks, url, notesPath?)`
Removes the note from the bookmark matching `url` and deletes it from the notes file.

### `applyNotes(bookmarks, notesPath?)`
Loads persisted notes and merges them onto the bookmarks array. Useful when loading bookmarks fresh from disk.

### `getAnnotatedWithNotes(bookmarks)`
Returns only the bookmarks that have a non-empty `note` field.

### `loadNotes(notesPath?)` / `saveNotes(notes, notesPath?)`
Low-level helpers for reading and writing the notes JSON file directly.

## Notes file

Notes are stored in `.tabmerge-notes.json` in the current working directory by default. Override by passing an explicit `notesPath`.

```json
{
  "https://example.com": {
    "text": "Review this quarterly",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
}
```

## Example

```js
const { addNote, applyNotes } = require('./bookmarkNotes');

let bookmarks = [{ url: 'https://example.com', title: 'Example' }];
bookmarks = addNote(bookmarks, 'https://example.com', 'revisit next sprint');
// bookmarks[0].note === 'revisit next sprint'

// Later, after reloading bookmarks from disk:
const withNotes = applyNotes(bookmarks);
```
