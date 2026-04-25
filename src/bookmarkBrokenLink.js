const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Check if a single URL is reachable (HEAD request, 5s timeout).
 * Resolves to { url, ok, status, error }.
 */
function checkUrl(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return resolve({ url, ok: false, status: null, error: 'invalid url' });
    }

    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(
      { method: 'HEAD', hostname: parsed.hostname, path: parsed.pathname + parsed.search, port: parsed.port || undefined },
      (res) => {
        const status = res.statusCode;
        resolve({ url, ok: status >= 200 && status < 400, status, error: null });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ url, ok: false, status: null, error: 'timeout' });
    });

    req.on('error', (err) => {
      resolve({ url, ok: false, status: null, error: err.message });
    });

    req.end();
  });
}

/**
 * Check all bookmarks for broken links with concurrency limit.
 * Returns array of { bookmark, result } for broken ones only.
 */
async function findBrokenLinks(bookmarks, { concurrency = 5, timeoutMs = 5000 } = {}) {
  const broken = [];
  const queue = [...bookmarks];

  async function worker() {
    while (queue.length > 0) {
      const bookmark = queue.shift();
      if (!bookmark || !bookmark.url) continue;
      const result = await checkUrl(bookmark.url, timeoutMs);
      if (!result.ok) {
        broken.push({ bookmark, result });
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return broken;
}

/**
 * Format broken link results as a human-readable string.
 */
function formatBrokenReport(broken) {
  if (broken.length === 0) return 'No broken links found.';
  const lines = [`Found ${broken.length} broken link(s):`, ''];
  for (const { bookmark, result } of broken) {
    const status = result.status ? `HTTP ${result.status}` : result.error;
    lines.push(`  [${status}] ${bookmark.title || '(no title)'} — ${bookmark.url}`);
  }
  return lines.join('\n');
}

module.exports = { checkUrl, findBrokenLinks, formatBrokenReport };
