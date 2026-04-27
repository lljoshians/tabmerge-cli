// bookmarkWordCloud.js — extract word frequency data from bookmark titles for word cloud generation

'use strict';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'be', 'was', 'are',
  'this', 'that', 'how', 'what', 'why', 'when', 'not', 'no', 'so',
  'my', 'your', 'we', 'i', 'you', 'he', 'she', 'they', 'up', 'do',
]);

/**
 * Tokenize a string into lowercase words, stripping punctuation.
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Build a word frequency map from an array of bookmarks.
 * @param {object[]} bookmarks
 * @returns {Map<string, number>}
 */
function buildWordFrequency(bookmarks) {
  const freq = new Map();
  for (const bm of bookmarks) {
    const words = tokenize(bm.title);
    for (const word of words) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }
  return freq;
}

/**
 * Return top N words sorted by frequency descending.
 * @param {Map<string, number>} freqMap
 * @param {number} n
 * @returns {{ word: string, count: number }[]}
 */
function topWords(freqMap, n = 50) {
  return [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Generate word cloud data from bookmarks.
 * @param {object[]} bookmarks
 * @param {{ topN?: number }} options
 * @returns {{ word: string, count: number, weight: number }[]}
 */
function generateWordCloud(bookmarks, { topN = 50 } = {}) {
  const freq = buildWordFrequency(bookmarks);
  const words = topWords(freq, topN);
  if (words.length === 0) return [];
  const maxCount = words[0].count;
  return words.map(({ word, count }) => ({
    word,
    count,
    weight: maxCount > 0 ? Math.round((count / maxCount) * 100) / 100 : 0,
  }));
}

module.exports = { tokenize, buildWordFrequency, topWords, generateWordCloud };
