# bookmarkCluster

Groups bookmarks into semantic clusters using domain co-location and Jaccard
similarity over title words and tags.

## API

### `clusterBookmarks(bookmarks, options?)`

Returns a `Map<string, Bookmark[]>` where each key is a cluster label (usually
the representative domain) and the value is the list of bookmarks in that cluster.

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `threshold` | number | `0.2` | Minimum Jaccard similarity to merge into an existing cluster |
| `groupByDomain` | boolean | `true` | Force same-domain bookmarks into the same cluster |

```js
const { clusterBookmarks } = require('./bookmarkCluster');

const clusters = clusterBookmarks(bookmarks, { threshold: 0.25 });
for (const [label, items] of clusters) {
  console.log(label, items.length);
}
```

### `flattenClusters(clusterMap)`

Flattens the cluster `Map` back to an array of bookmarks, each annotated with
a `cluster` string property.

```js
const flat = flattenClusters(clusters);
// flat[0] => { title: '...', url: '...', cluster: 'github.com' }
```

### `domainKey(url)`

Extracts a normalised domain (strips `www.`) from a URL string.

### `jaccard(setA, setB)`

Computes the Jaccard similarity coefficient between two `Set` instances.

## Integration with pipeline

Add clustering as a post-processing step after deduplication:

```js
const merged = mergeBookmarks(files);
const deduped = deduplicateBookmarks(merged);
const clusters = clusterBookmarks(deduped);
```
