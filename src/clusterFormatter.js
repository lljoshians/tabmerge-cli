/**
 * clusterFormatter.js
 * Renders a cluster Map produced by bookmarkCluster into JSON or plain text.
 */

const { escapeHtml } = require('./formatter');

/**
 * Render clusters as a structured JSON object.
 * @param {Map<string, object[]>} clusterMap
 * @returns {object}
 */
function formatClustersAsJson(clusterMap) {
  const out = {};
  for (const [label, bookmarks] of clusterMap) {
    out[label] = bookmarks.map(bm => ({
      title: bm.title || '',
      url: bm.url || '',
      folder: bm.folder || null,
      tags: bm.tags || [],
      addDate: bm.addDate || null,
    }));
  }
  return out;
}

/**
 * Render clusters as an HTML string (one <section> per cluster).
 * @param {Map<string, object[]>} clusterMap
 * @returns {string}
 */
function formatClustersAsHtml(clusterMap) {
  const sections = [];
  for (const [label, bookmarks] of clusterMap) {
    const items = bookmarks
      .map(bm => `    <li><a href="${escapeHtml(bm.url || '')}">${escapeHtml(bm.title || bm.url || '')}</a></li>`)
      .join('\n');
    sections.push(
      `  <section class="cluster" data-cluster="${escapeHtml(label)}">\n` +
      `    <h2>${escapeHtml(label)}</h2>\n` +
      `    <ul>\n${items}\n    </ul>\n  </section>`
    );
  }
  return [
    '<!DOCTYPE html>',
    '<html><head><meta charset="utf-8"><title>Bookmark Clusters</title></head>',
    '<body>',
    ...sections,
    '</body></html>',
  ].join('\n');
}

/**
 * Render clusters as a human-readable plain-text summary.
 * @param {Map<string, object[]>} clusterMap
 * @returns {string}
 */
function formatClustersAsText(clusterMap) {
  const lines = [];
  for (const [label, bookmarks] of clusterMap) {
    lines.push(`[${label}] (${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''})`);
    for (const bm of bookmarks) {
      lines.push(`  - ${bm.title || '(no title)'} <${bm.url || ''}>`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

module.exports = { formatClustersAsJson, formatClustersAsHtml, formatClustersAsText };
