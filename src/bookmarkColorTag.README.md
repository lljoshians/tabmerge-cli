# bookmarkColorTag

Assign and manage color tags on bookmarks for visual organization and quick filtering.

## Functions

### `setColor(bookmark, color)`
Returns a new bookmark object with the given color assigned.
Throws if the color is not in the valid set.

```js
const tagged = setColor(bookmark, 'red');
```

### `clearColor(bookmark)`
Returns a new bookmark with the `color` field removed.

```js
const untagged = clearColor(bookmark);
```

### `colorWhere(bookmarks, predicate, color)`
Applies a color to all bookmarks that match the predicate function.

```js
const result = colorWhere(bookmarks, b => b.folder === 'Work', 'blue');
```

### `getByColor(bookmarks, color)`
Filters bookmarks to only those with the specified color.

```js
const reds = getByColor(bookmarks, 'red');
```

### `colorFrequency(bookmarks)`
Returns an object mapping each color to how many bookmarks use it.

```js
const freq = colorFrequency(bookmarks);
// { red: 3, blue: 1 }
```

## Valid Colors

`red`, `orange`, `yellow`, `green`, `blue`, `purple`, `gray`
