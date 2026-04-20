/**
 * configLoader.js
 * Loads and validates a JSON config file for tabmerge-cli.
 * Allows users to persist default options (output format, sort, filters, etc.)
 * in a .tabmergerc or tabmerge.config.json file.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILENAMES = [
  '.tabmergerc',
  '.tabmergerc.json',
  'tabmerge.config.json',
];

const VALID_FORMATS = ['json', 'html'];
const VALID_SORT_FIELDS = ['title', 'date', 'folder'];

/**
 * Search for a config file starting from the given directory,
 * walking up to the filesystem root.
 * @param {string} startDir
 * @returns {string|null} resolved path to config file, or null
 */
function findConfigFile(startDir) {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root;

  while (true) {
    for (const name of CONFIG_FILENAMES) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    if (dir === root) break;
    dir = path.dirname(dir);
  }
  return null;
}

/**
 * Parse and validate a config object.
 * Unknown keys are ignored; invalid values throw.
 * @param {object} raw
 * @returns {object} validated config
 */
function validateConfig(raw) {
  const config = {};

  if (raw.format !== undefined) {
    if (!VALID_FORMATS.includes(raw.format)) {
      throw new Error(`Invalid config: 'format' must be one of ${VALID_FORMATS.join(', ')}`);
    }
    config.format = raw.format;
  }

  if (raw.sort !== undefined) {
    if (!VALID_SORT_FIELDS.includes(raw.sort)) {
      throw new Error(`Invalid config: 'sort' must be one of ${VALID_SORT_FIELDS.join(', ')}`);
    }
    config.sort = raw.sort;
  }

  if (raw.output !== undefined) {
    if (typeof raw.output !== 'string') {
      throw new Error("Invalid config: 'output' must be a string");
    }
    config.output = raw.output;
  }

  if (raw.deduplicate !== undefined) {
    config.deduplicate = Boolean(raw.deduplicate);
  }

  if (raw.keyword !== undefined) {
    if (typeof raw.keyword !== 'string') {
      throw new Error("Invalid config: 'keyword' must be a string");
    }
    config.keyword = raw.keyword;
  }

  if (raw.folder !== undefined) {
    if (typeof raw.folder !== 'string') {
      throw new Error("Invalid config: 'folder' must be a string");
    }
    config.folder = raw.folder;
  }

  if (raw.since !== undefined) {
    if (typeof raw.since !== 'string') {
      throw new Error("Invalid config: 'since' must be a date string");
    }
    config.since = raw.since;
  }

  return config;
}

/**
 * Load config from a specific file path.
 * @param {string} filePath
 * @returns {object} validated config
 */
function loadConfigFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return validateConfig(raw);
}

/**
 * Load config by searching upward from cwd, or return empty config.
 * @param {string} [startDir=process.cwd()]
 * @returns {{ config: object, configPath: string|null }}
 */
function loadConfig(startDir = process.cwd()) {
  const configPath = findConfigFile(startDir);
  if (!configPath) {
    return { config: {}, configPath: null };
  }
  const config = loadConfigFile(configPath);
  return { config, configPath };
}

module.exports = { loadConfig, loadConfigFile, findConfigFile, validateConfig };
