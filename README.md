# tabmerge-cli

> CLI tool to merge and deduplicate browser-exported bookmark files into a single structured JSON or HTML file.

---

## Installation

```bash
npm install -g tabmerge-cli
```

---

## Usage

```bash
tabmerge [options] <files...>
```

### Example

```bash
# Merge multiple bookmark files into a single JSON output
tabmerge bookmarks-chrome.html bookmarks-firefox.html -o merged.json

# Output as HTML instead
tabmerge bookmarks-chrome.html bookmarks-safari.html --format html -o merged.html
```

### Options

| Flag | Description |
|------|-------------|
| `-o, --output <file>` | Output file path (default: `stdout`) |
| `--format <type>` | Output format: `json` or `html` (default: `json`) |
| `--no-dedup` | Skip deduplication step |
| `--verbose` | Print merge summary to console |

---

## How It Works

1. Parses each browser-exported `.html` bookmark file
2. Deduplicates entries by URL
3. Merges folder structures where possible
4. Outputs a clean, structured `JSON` or `HTML` file

---

## License

[MIT](./LICENSE)