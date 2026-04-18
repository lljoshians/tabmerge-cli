function previewBookmarks(bookmarks, options = {}) {
  const limit = options.limit || 10;
  const slice = bookmarks.slice(0, limit);
  const lines = slice.map((b, i) => {
    const folder = b.folder ? `[${b.folder}] ` : '';
    const date = b.addDate ? new Date(b.addDate * 1000).toISOString().slice(0, 10) : 'unknown';
    return `${String(i + 1).padStart(3, ' ')}. ${folder}${b.title || '(no title)'}\n     ${b.url}  (${date})`;
  });

  const header = `Showing ${slice.length} of ${bookmarks.length} bookmark(s):`;
  const divider = '-'.repeat(60);
  return [header, divider, ...lines, divider].join('\n');
}

function previewFolders(bookmarks) {
  const folderMap = {};
  for (const b of bookmarks) {
    const f = b.folder || '(none)';
    folderMap[f] = (folderMap[f] || 0) + 1;
  }
  const lines = Object.entries(folderMap)
    .sort((a, b) => b[1] - a[1])
    .map(([folder, count]) => `  ${folder}: ${count}`);
  return ['Folders:', ...lines].join('\n');
}

module.exports = { previewBookmarks, previewFolders };
