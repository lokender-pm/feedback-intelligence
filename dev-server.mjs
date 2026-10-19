// Local preview: serves the page and runs api/analyze.js the way Vercel does.
// Usage:  node dev-server.mjs            (pre-run example only)
//         $env:GEMINI_API_KEY="..."; node dev-server.mjs   (live AI, PowerShell)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from './api/analyze.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/analyze') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }
    res.status = code => { res.statusCode = code; return res; };
    res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return res; };
    return handler(req, res);
  }
  const path = normalize(join(root, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
  if (!path.startsWith(root) || path.includes('dev-server')) { res.statusCode = 404; return res.end('Not found'); }
  try {
    const file = await readFile(path);
    res.setHeader('Content-Type', TYPES[extname(path)] || 'application/octet-stream');
    res.end(file);
  } catch {
    res.statusCode = 404; res.end('Not found');
  }
}).listen(PORT, () => console.log(`Feedback Intelligence running at http://localhost:${PORT}`));
