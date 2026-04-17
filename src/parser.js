const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Parse a Netscape bookmark HTML file exported from a browser.
 * Returns a flat array of bookmark objects.
 */
function parseBookmarkFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  const html = fs.readFileSync(resolved, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const bookmarks = [];

  const anchors = doc.querySelectorAll('a');
  anchors.forEach((a) => {
    const url = a.getAttribute('href') || '';
    const title = a.textContent.trim();
    const addDate = a.getAttribute('add_date') || null;
    const tags = a.getAttribute('tags') || '';

    if (!url) return;

    bookmarks.push({
      url,
      title,
      addDate: addDate ? parseInt(addDate, 10) : null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  });

  return bookmarks;
}

module.exports = { parseBookmarkFile };
