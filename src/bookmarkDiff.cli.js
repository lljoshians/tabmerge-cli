'use strict';

/**
 * bookmarkDiff.cli.js
 * CLI helper: load two bookmark files, diff them, and print the result.
 * Usage: node bookmarkDiff.cli.js <prev-file> <next-file>
 */

const path = require('path');
const { parseBookmarkFile } = require('./parser');
const { diffBookmarks, formatDiff } = require('./bookmarkDiff');

async function runDiffCli(argv) {
  const args = argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: bookmarkDiff.cli.js <prev-file> <next-file> [--json]');
    return 0;
  }

  const jsonMode = args.includes('--json');
  const files = args.filter(a => !a.startsWith('--'));

  if (files.length < 2) {
    console.error('Error: two bookmark files required.');
    console.error('Usage: bookmarkDiff.cli.js <prev-file> <next-file> [--json]');
    return 1;
  }

  const [prevPath, nextPath] = files.map(f => path.resolve(f));

  let prev, next;
  try {
    prev = await parseBookmarkFile(prevPath);
  } catch (err) {
    console.error(`Failed to parse prev file: ${err.message}`);
    return 1;
  }
  try {
    next = await parseBookmarkFile(nextPath);
  } catch (err) {
    console.error(`Failed to parse next file: ${err.message}`);
    return 1;
  }

  const diff = diffBookmarks(prev, next);

  if (jsonMode) {
    console.log(JSON.stringify(diff, null, 2));
  } else {
    console.log(formatDiff(diff));
  }

  return 0;
}

if (require.main === module) {
  runDiffCli(process.argv).then(code => process.exit(code));
}

module.exports = { runDiffCli };
