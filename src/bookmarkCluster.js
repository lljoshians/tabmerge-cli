/**
 * bookmarkCluster.js
 * Groups bookmarks into semantic clusters based on domain, keywords, and tags.
 */

/**
 * Extract a simple domain key from a URL (e.g. "github.com").
 */
function domainKey(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

/**
 * Build a term set from a bookmark's title and tags.
 */
function termSet(bookmark) {
  const words = (bookmark.title || '')
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3);
  const tags = (bookmark.tags || []).map(t => t.toLowerCase());
  return new Set([...words, ...tags]);
}

/**
 * Compute Jaccard similarity between two Sets.
 */
function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  const intersection = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / union;
}

/**
 * Cluster bookmarks using a greedy single-linkage approach.
 * @param {object[]} bookmarks
 * @param {object} options
 * @param {number} [options.threshold=0.2] - Jaccard similarity threshold
 * @param {boolean} [options.groupByDomain=true] - force same-domain into same cluster
 * @returns {Map<string, object[]>} cluster label -> bookmarks
 */
function clusterBookmarks(bookmarks, options = {}) {
  const { threshold = 0.2, groupByDomain = true } = options;
  const clusters = [];
  const terms = bookmarks.map(termSet);

  for (let i = 0; i < bookmarks.length; i++) {
    const bm = bookmarks[i];
    const domain = domainKey(bm.url || '');
    let assigned = false;

    for (const cluster of clusters) {
      const rep = cluster[0];
      const repDomain = domainKey(rep.url || '');
      const repIdx = bookmarks.indexOf(rep);
      const sim = jaccard(terms[i], terms[repIdx]);
      const sameDomain = groupByDomain && domain === repDomain && domain !== 'unknown';

      if (sameDomain || sim >= threshold) {
        cluster.push(bm);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      clusters.push([bm]);
    }
  }

  const result = new Map();
  clusters.forEach((cluster, idx) => {
    const label = domainKey(cluster[0].url || '') || `cluster-${idx}`;
    const key = result.has(label) ? `${label}-${idx}` : label;
    result.set(key, cluster);
  });

  return result;
}

/**
 * Flatten clusters back to an array, adding a `cluster` property.
 */
function flattenClusters(clusterMap) {
  const out = [];
  for (const [label, bookmarks] of clusterMap) {
    for (const bm of bookmarks) {
      out.push({ ...bm, cluster: label });
    }
  }
  return out;
}

module.exports = { clusterBookmarks, flattenClusters, domainKey, jaccard, termSet };
