# bookmarkBrokenLink

Detects broken (unreachable) links in a bookmark collection by sending lightweight HTTP HEAD requests.

## API

### `checkUrl(url, timeoutMs?)`

Checks a single URL. Returns a promise resolving to:

```js
{ url, ok, status, error }
```

- `ok` — `true` if the server responded with 2xx or 3xx
- `status` — HTTP status code or `null`
- `error` — error message string or `null`

### `findBrokenLinks(bookmarks, options?)`

Checks all bookmarks concurrently and returns only the broken ones.

```js
const broken = await findBrokenLinks(bookmarks, { concurrency: 5, timeoutMs: 5000 });
// [{ bookmark, result }, ...]
```

Options:

| Option        | Default | Description                         |
|---------------|---------|-------------------------------------|
| `concurrency` | `5`     | Max simultaneous requests           |
| `timeoutMs`   | `5000`  | Per-request timeout in milliseconds |

Bookmarks without a `url` field are silently skipped.

### `formatBrokenReport(broken)`

Formats the broken-link results as a human-readable string suitable for CLI output.

```js
console.log(formatBrokenReport(broken));
// Found 2 broken link(s):
//   [HTTP 404] My Old Page — https://example.com/old
//   [timeout]  Another Site — https://unreachable.example
```

## Example

```js
const { findBrokenLinks, formatBrokenReport } = require('./bookmarkBrokenLink');
const bookmarks = require('./my-bookmarks.json');

findBrokenLinks(bookmarks).then((broken) => {
  console.log(formatBrokenReport(broken));
});
```
