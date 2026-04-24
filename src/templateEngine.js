/**
 * templateEngine.js
 * Renders bookmarks using simple string templates with placeholder substitution.
 */

const DEFAULT_TEMPLATES = {
  item: '- [{title}]({url}) [{folder}]',
  folder: '### {folder} ({count} bookmarks)',
  summary: 'Total: {total} bookmarks across {folders} folders'
};

/**
 * Replace {placeholder} tokens in a template string with values from a data object.
 * @param {string} template
 * @param {Object} data
 * @returns {string}
 */
function renderTemplate(template, data) {
  if (typeof template !== 'string') throw new TypeError('template must be a string');
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : match;
  });
}

/**
 * Render a list of bookmarks using item and folder templates.
 * @param {Array} bookmarks
 * @param {Object} templates - optional overrides for item/folder/summary keys
 * @returns {string}
 */
function renderBookmarks(bookmarks, templates = {}) {
  const tmpl = Object.assign({}, DEFAULT_TEMPLATES, templates);
  const folderCounts = {};

  const lines = bookmarks.map(bm => {
    const folder = bm.folder || 'Uncategorized';
    folderCounts[folder] = (folderCounts[folder] || 0) + 1;
    return renderTemplate(tmpl.item, {
      title: bm.title || 'Untitled',
      url: bm.url || '',
      folder
    });
  });

  const folderCount = Object.keys(folderCounts).length;
  const summary = renderTemplate(tmpl.summary, {
    total: bookmarks.length,
    folders: folderCount
  });

  return lines.join('\n') + (lines.length ? '\n\n' + summary : summary);
}

/**
 * Render folder headers for grouped bookmark output.
 * @param {string} folder
 * @param {number} count
 * @param {string} template
 * @returns {string}
 */
function renderFolderHeader(folder, count, template = DEFAULT_TEMPLATES.folder) {
  return renderTemplate(template, { folder, count });
}

module.exports = { renderTemplate, renderBookmarks, renderFolderHeader, DEFAULT_TEMPLATES };
