const fs = require('fs');
const path = require('path');
const { formatAsJson, formatAsHtml } = require('./formatter');

function exportToFile(bookmarks, outputPath, options = {}) {
  const ext = path.extname(outputPath).toLowerCase();
  const format = options.format || (ext === '.html' ? 'html' : 'json');

  let content;
  if (format === 'html') {
    content = formatAsHtml(bookmarks);
  } else {
    content = formatAsJson(bookmarks, options.pretty !== false);
  }

  fs.writeFileSync(outputPath, content, 'utf8');
  return { outputPath, format, count: bookmarks.length };
}

function exportToStdout(bookmarks, options = {}) {
  const format = options.format || 'json';
  let content;
  if (format === 'html') {
    content = formatAsHtml(bookmarks);
  } else {
    content = formatAsJson(bookmarks, options.pretty !== false);
  }
  process.stdout.write(content + '\n');
  return { format, count: bookmarks.length };
}

function resolveOutputPath(outputArg, format) {
  if (!outputArg) return null;
  const ext = path.extname(outputArg);
  if (!ext) {
    return outputArg + (format === 'html' ? '.html' : '.json');
  }
  return outputArg;
}

module.exports = { exportToFile, exportToStdout, resolveOutputPath };
