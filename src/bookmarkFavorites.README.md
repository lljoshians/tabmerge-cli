# bookmarkFavorites

Persist and manage a list of favorite bookmarks across sessions.

## Overview

Favorites are stored in a JSON file (default: `.tabmerge-favorites.json` in the working directory). You can override the path via the `TABMERGE_FAVORITES_FILE` environment variable or by passing a `filePath` argument to each function.

## API

### `resolveFavoritesPath(filePath?)`
Returns the resolved path to the favorites file.

### `loadFavorites(filePath?)`
Loads and returns the array of favorited bookmarks. Returns `[]` if the file does not exist or is invalid.

### `saveFavorites(favorites, filePath?)`
Writes the favorites array to disk.

### `addFavorite(bookmark, filePath?)`
Adds a bookmark to favorites (no-op if already present). Stamps a `favoritedAt` ISO timestamp. Returns the updated list.

### `removeFavorite(url, filePath?)`
Removes the bookmark with the given URL from favorites. Returns the updated list.

### `isFavorite(url, filePath?)`
Returns `true` if the given URL is in favorites.

### `getFavorites(filePath?)`
Alias for `loadFavorites`.

### `markFavoritesInList(bookmarks, filePath?)`
Annotates each bookmark in the provided array with an `isFavorite` boolean field.

## Example

```js
const { addFavorite, markFavoritesInList } = require('./bookmarkFavorites');

addFavorite({ url: 'https://example.com', title: 'Example' });

const annotated = markFavoritesInList(allBookmarks);
console.log(annotated.filter(b => b.isFavorite));
```
