const { parseBookmarkFile } = require('./parser');
const { mergeBookmarks } = require('./merger');
const { deduplicateBookmarks } = require('./deduplicator');
const { applyFilters } = require('./filter');
const { applySort } = require('./sorter');
const { computeStats } = require('./stats');
const { exportToFile, exportToStdout, resolveOutputPath } = require('./exporter');

function runPipeline(inputFiles, options = {}) {
  const parsed = inputFiles.map(f => parseBookmarkFile(f));
  let bookmarks = mergeBookmarks(parsed);

  if (!options.noDedupe) {
    bookmarks = deduplicateBookmarks(bookmarks);
  }

  if (options.filters) {
    bookmarks = applyFilters(bookmarks, options.filters);
  }

  if (options.sort) {
    bookmarks = applySort(bookmarks, options.sort);
  }

  const stats = computeStats(bookmarks);

  if (options.output) {
    const outPath = resolveOutputPath(options.output, options.format || 'json');
    exportToFile(bookmarks, outPath, { format: options.format, pretty: options.pretty });
    return { bookmarks, stats, outputPath: outPath };
  } else {
    exportToStdout(bookmarks, { format: options.format, pretty: options.pretty });
    return { bookmarks, stats, outputPath: null };
  }
}

module.exports = { runPipeline };
