const fs = require('fs');
const path = require('path');
const { parseBookmarkFile } = require('./parser');
const { deduplicateBookmarks } = require('./deduplicator');
const { mergeBookmarks } = require('./merger');
const { formatBookmarks } = require('./formatter');
const { computeStats, formatStats } = require('./stats');
const { applyFilters } = require('./filter');

function printUsage() {
  console.log(`
Usage: tabmerge [options] <file1> [file2 ...]

Options:
  --format <json|html>   Output format (default: json)
  --output <file>        Write output to file (default: stdout)
  --keyword <term>       Filter bookmarks by keyword
  --folder <name>        Filter bookmarks by folder
  --since <date>         Filter bookmarks added after date (ISO format)
  --stats                Print statistics summary
  --help                 Show this help message
`);
}

function parseArgs(argv) {
  const args = { files: [], format: 'json', output: null, stats: false, filter: {} };
  let i = 0;
  while (i < argv.length) {
    switch (argv[i]) {
      case '--format': args.format = argv[++i]; break;
      case '--output': args.output = argv[++i]; break;
      case '--keyword': args.filter.keyword = argv[++i]; break;
      case '--folder': args.filter.folder = argv[++i]; break;
      case '--since': args.filter.since = argv[++i]; break;
      case '--stats': args.stats = true; break;
      case '--help': args.help = true; break;
      default: if (!argv[i].startsWith('--')) args.files.push(argv[i]);
    }
    i++;
  }
  return args;
}

function run(argv) {
  const args = parseArgs(argv);

  if (args.help || args.files.length === 0) {
    printUsage();
    return;
  }

  const parsed = args.files.map((f) => parseBookmarkFile(fs.readFileSync(f, 'utf8')));
  let merged = mergeBookmarks(parsed);
  let deduped = deduplicateBookmarks(merged);
  let filtered = applyFilters(deduped, args.filter);

  if (args.stats) {
    const stats = computeStats(filtered);
    console.error(formatStats(stats));
  }

  const output = formatBookmarks(filtered, args.format);

  if (args.output) {
    fs.writeFileSync(path.resolve(args.output), output, 'utf8');
    console.error(`Written to ${args.output}`);
  } else {
    console.log(output);
  }
}

module.exports = { printUsage, parseArgs, run };
