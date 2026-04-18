#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseBookmarkFile } = require('./parser');
const { mergeBookmarks } = require('./merger');
const { deduplicateBookmarks } = require('./deduplicator');
const { formatBookmarks } = require('./formatter');

function printUsage() {
  console.log(`
Usage: tabmerge [options] <file1> <file2> [file3...]

Options:
  -o, --output <file>   Output file (default: stdout)
  -f, --format <fmt>    Output format: json or html (default: json)
  --no-dedup            Skip deduplication
  -h, --help            Show this help message
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { format: 'json', dedup: true, output: null, files: [] };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '-f' || arg === '--format') {
      opts.format = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      opts.output = args[++i];
    } else if (arg === '--no-dedup') {
      opts.dedup = false;
    } else if (!arg.startsWith('-')) {
      opts.files.push(arg);
    }
  }

  return opts;
}

function run(argv) {
  const opts = parseArgs(argv);

  if (opts.files.length < 2) {
    console.error('Error: at least two input files are required.');
    printUsage();
    process.exit(1);
  }

  if (!['json', 'html'].includes(opts.format)) {
    console.error(`Error: unsupported format "${opts.format}". Use json or html.`);
    process.exit(1);
  }

  const parsed = opts.files.map(f => {
    const content = fs.readFileSync(path.resolve(f), 'utf-8');
    return parseBookmarkFile(content);
  });

  let merged = mergeBookmarks(parsed);
  if (opts.dedup) merged = deduplicateBookmarks(merged);

  const output = formatBookmarks(merged, opts.format);

  if (opts.output) {
    fs.writeFileSync(path.resolve(opts.output), output, 'utf-8');
    console.error(`Written to ${opts.output}`);
  } else {
    process.stdout.write(output);
  }
}

module.exports = { run, parseArgs };

if (require.main === module) {
  run(process.argv);
}
