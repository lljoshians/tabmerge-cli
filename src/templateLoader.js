/**
 * templateLoader.js
 * Loads template definitions from a JSON or JS config file.
 */

const fs = require('fs');
const path = require('path');
const { DEFAULT_TEMPLATES } = require('./templateEngine');

const SUPPORTED_EXTENSIONS = ['.json', '.js'];

/**
 * Check if a template file path is valid and readable.
 * @param {string} filePath
 * @returns {boolean}
 */
function isReadableFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load templates from a file. Supports .json and .js (CommonJS exports).
 * @param {string} filePath
 * @returns {Object} merged templates
 */
function loadTemplatesFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported template file extension: ${ext}`);
  }
  if (!isReadableFile(filePath)) {
    throw new Error(`Template file not found or not readable: ${filePath}`);
  }
  const raw = ext === '.json'
    ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
    : require(path.resolve(filePath));

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new TypeError('Template file must export a plain object');
  }
  return Object.assign({}, DEFAULT_TEMPLATES, raw);
}

/**
 * Load templates from file if path provided, otherwise return defaults.
 * @param {string|null} filePath
 * @returns {Object}
 */
function loadTemplates(filePath) {
  if (!filePath) return Object.assign({}, DEFAULT_TEMPLATES);
  return loadTemplatesFromFile(filePath);
}

module.exports = { loadTemplates, loadTemplatesFromFile, isReadableFile };
