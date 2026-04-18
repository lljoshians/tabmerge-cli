// pipeline.js - orchestrate the full bookmark processing pipeline
const { parseBookmarkFile } = require('./parser');
const { mergeBookmarks } = require('./merger');
const { deduplicateBookmarks } = require('./deduplicator');
const { validateAll } = require('./validator');
const { applyFilters } = require('./filter');
const { applySort } = require('./sorter');
const { tagAll } = require('./tagger');
const { formatBookmarks } = require('./formatter');
const { exportToFile, exportToStdout } = require('./exporter');

/**
 * Run the full pipeline given parsed CLI args.
 * @param {object} args - from parseArgs()
 */
async function runPipeline(args) {
  // 1. Parse all input files
  const parsed = args.inputs.map(f => parseBookmarkFile(f));

  // 2. Merge
  let bookmarks = mergeBookmarks(parsed);

  // 3. Validate (warn only)
  const { valid, invalid } = validateAll(bookmarks);
  if (invalid.length > 0) {
    console.warn(`Warning: ${invalid.length} invalid bookmark(s) skipped.`);
  }
  bookmarks = valid;

  // 4. Deduplicate
  if (!args.noDedupe) {
    bookmarks = deduplicateBookmarks(bookmarks);
  }

  // 5. Tag
  bookmarks = tagAll(bookmarks);

  // 6. Filter
  bookmarks = applyFilters(bookmarks, args);

  // 7. Sort
  bookmarks = applySort(bookmarks, args.sort);

  // 8. Format
  const output = formatBookmarks(bookmarks, args.format || 'json');

  // 9. Export
  if (args.output) {
    exportToFile(output, args.output);
  } else {
    exportToStdout(output);
  }

  return bookmarks;
}

module.exports = { runPipeline };
