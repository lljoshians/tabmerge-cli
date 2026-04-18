const fs = require('fs');
const path = require('path');
const { parseBookmarkFile } = require('./parser');
const { deduplicateBookmarks } = require('./deduplicator');
const { mergeBookmarks } = require('./merger');
const { formatBookmarks } = require('./formatter');
const { computeStats, formatStats } = require('./stats');

function printUsage() {
  console.log(`
Usage: tabmerge [options] <file1> [file2 ...]

Options:
  --format <json|html>   Output format (default: json)
  --output <file>        Write output to file instead of stdout
  --stats                Print statistics about the merged bookmarks
  --no-dedup             Skip deduplication
  --help                 Show this help message
`);
}

function parseArgs(argv) {
  const args = { files: [], format: 'json', output: null, stats: false, dedup: true };
  const raw = argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '--help') { args.help = true; }
    else if (raw[i] === '--format') { args.format = raw[++i]; }
    else if (raw[i] === '--output') { args.output = raw[++i]; }
    else if (raw[i] === '--stats') { args.stats = true; }
    else if (raw[i] === '--no-dedup') { args.dedup = false; }
    else { args.files.push(raw[i]); }
  }
  return args;
}

function run(argv) {
  const args = parseArgs(argv);

  if (args.help || args.files.length === 0) {
    printUsage();
    return;
  }

  const collections = args.files.map((f) => {
    const content = fs.readFileSync(path.resolve(f), 'utf8');
    return parseBookmarkFile(content, path.extname(f));
  });

  let merged = mergeBookmarks(collections);

  if (args.dedup) {
    merged = deduplicateBookmarks(merged);
  }

  if (args.stats) {
    const stats = computeStats(merged);
    console.error(formatStats(stats));
  }

  const output = formatBookmarks(merged, args.format);

  if (args.output) {
    fs.writeFileSync(path.resolve(args.output), output, 'utf8');
    console.error(`Written to ${args.output}`);
  } else {
    console.log(output);
  }
}

module.exports = { printUsage, parseArgs, run };
