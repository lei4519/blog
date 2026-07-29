import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

const outputDirectory = resolve('out');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function findFile(pathname: string): Promise<string | undefined> {
  const requestedPath = resolve(outputDirectory, `.${pathname}`);
  if (requestedPath !== outputDirectory && !requestedPath.startsWith(`${outputDirectory}${sep}`)) {
    return undefined;
  }

  const routePath = requestedPath.endsWith(sep) ? requestedPath.slice(0, -1) : requestedPath;
  const candidates = pathname === '/'
    ? [join(outputDirectory, 'index.html')]
    : [`${routePath}.html`, join(requestedPath, 'index.html'), requestedPath];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next clean-URL candidate.
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let pathname: string;
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad Request');
      return;
    }

    const file = await findFile(pathname);
    if (!file) {
      const notFound = join(outputDirectory, '_not-found.html');
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      if (request.method === 'HEAD') response.end();
      else createReadStream(notFound).pipe(response);
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[extname(file).toLowerCase()] ?? 'application/octet-stream',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) response.writeHead(500);
    response.end('Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving ${outputDirectory} at http://localhost:${port}`);
});
