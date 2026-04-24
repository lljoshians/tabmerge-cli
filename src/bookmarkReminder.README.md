# bookmarkReminder

Schedule reminders for bookmarks so you don't forget to revisit them.

## Functions

### `addReminder(reminders, bookmark, remindAt, note?)`
Adds a new reminder or updates an existing one for the given bookmark URL.
- `remindAt` — ISO 8601 date string for when to be reminded
- `note` — optional text note

### `removeReminder(reminders, url)`
Removes the reminder associated with the given URL.

### `getDueReminders(reminders, now?)`
Returns all undismissed reminders whose `remindAt` is on or before `now` (defaults to current time).

### `dismissReminder(reminders, url)`
Marks a reminder as dismissed without deleting it.

### `formatReminders(reminders)`
Returns a human-readable string listing all reminders.

### `loadReminders(filePath?)`
Loads reminders from a JSON file. Defaults to `.tabmerge-reminders.json` in the current directory.

### `saveReminders(reminders, filePath?)`
Persists reminders to a JSON file.

## Example

```js
const r = require('./bookmarkReminder');

let reminders = r.loadReminders();
reminders = r.addReminder(reminders, { url: 'https://example.com', title: 'Example' }, '2025-06-01T09:00:00Z', 'Review this');
r.saveReminders(reminders);

const due = r.getDueReminders(reminders);
console.log(r.formatReminders(due));
```

## Storage format

Reminders are stored as a JSON array:

```json
[
  {
    "url": "https://example.com",
    "title": "Example",
    "remindAt": "2025-06-01T09:00:00.000Z",
    "note": "Review this",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z",
    "dismissed": false
  }
]
```
