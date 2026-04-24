/**
 * bookmarkExportHistory.js
 * Tracks and persists a log of past export operations.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_HISTORY_FILE = '.tabmerge-history.json';

function resolveHistoryPath(historyFile = DEFAULT_HISTORY_FILE) {
  return path.isAbsolute(historyFile)
    ? historyFile
    : path.join(process.cwd(), historyFile);
}

function loadHistory(historyFile) {
  const filePath = resolveHistoryPath(historyFile);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries, historyFile) {
  const filePath = resolveHistoryPath(historyFile);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf8');
}

function recordExport({ outputPath, format, bookmarkCount, sources = [], historyFile } = {}) {
  const entries = loadHistory(historyFile);
  const entry = {
    timestamp: new Date().toISOString(),
    outputPath: outputPath || null,
    format: format || 'json',
    bookmarkCount: bookmarkCount || 0,
    sources,
  };
  entries.push(entry);
  saveHistory(entries, historyFile);
  return entry;
}

function getHistory(historyFile) {
  return loadHistory(historyFile);
}

function clearHistory(historyFile) {
  saveHistory([], historyFile);
}

function formatHistoryEntry(entry) {
  const date = entry.timestamp ? entry.timestamp.slice(0, 19).replace('T', ' ') : 'unknown';
  const src = entry.sources && entry.sources.length ? entry.sources.join(', ') : 'n/a';
  return `[${date}] format=${entry.format} count=${entry.bookmarkCount} output=${entry.outputPath || 'stdout'} sources=${src}`;
}

function formatHistory(entries) {
  if (!entries.length) return 'No export history found.';
  return entries.map(formatHistoryEntry).join('\n');
}

module.exports = {
  resolveHistoryPath,
  loadHistory,
  saveHistory,
  recordExport,
  getHistory,
  clearHistory,
  formatHistoryEntry,
  formatHistory,
};
