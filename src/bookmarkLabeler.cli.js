#!/usr/bin/env node
/**
 * bookmarkLabeler.cli.js
 * CLI wrapper for bookmark labeling operations.
 *
 * Usage:
 *   node bookmarkLabeler.cli.js add    <input.json> <label> [--where <keyword>]
 *   node bookmarkLabeler.cli.js remove <input.json> <label>
 *   node bookmarkLabeler.cli.js list   <input.json> <label>
 *   node bookmarkLabeler.cli.js freq   <input.json>
 */

const fs = require('fs');
const path = require('path');
const { addLabel, removeLabel, labelWhere, getByLabel, labelFrequency } = require('./bookmarkLabeler');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
}

function printUsage() {
  console.log('Usage:');
  console.log('  bookmarkLabeler.cli.js add    <file> <label> [--where <keyword>]');
  console.log('  bookmarkLabeler.cli.js remove <file> <label>');
  console.log('  bookmarkLabeler.cli.js list   <file> <label>');
  console.log('  bookmarkLabeler.cli.js freq   <file>');
}

function run(argv) {
  const [cmd, filePath, label, ...rest] = argv;

  if (!cmd || !filePath) {
    printUsage();
    process.exit(1);
  }

  const bookmarks = loadJson(filePath);

  if (cmd === 'add') {
    const whereIdx = rest.indexOf('--where');
    let result;
    if (whereIdx !== -1 && rest[whereIdx + 1]) {
      const keyword = rest[whereIdx + 1].toLowerCase();
      result = labelWhere(bookmarks, (b) =>
        (b.title || '').toLowerCase().includes(keyword) ||
        (b.url || '').toLowerCase().includes(keyword), label);
    } else {
      result = bookmarks.map((b) => addLabel(b, label));
    }
    console.log(JSON.stringify(result, null, 2));

  } else if (cmd === 'remove') {
    const result = bookmarks.map((b) => removeLabel(b, label));
    console.log(JSON.stringify(result, null, 2));

  } else if (cmd === 'list') {
    const matches = getByLabel(bookmarks, label);
    matches.forEach((b) => console.log(`${b.title || b.url}  [${b.url}]`));
    console.error(`\n${matches.length} bookmark(s) with label "${label}"`);

  } else if (cmd === 'freq') {
    const freq = labelFrequency(bookmarks);
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([lbl, count]) => console.log(`${count}\t${lbl}`));

  } else {
    console.error(`Unknown command: ${cmd}`);
    printUsage();
    process.exit(1);
  }
}

if (require.main === module) {
  run(process.argv.slice(2));
}

module.exports = { run, printUsage };
