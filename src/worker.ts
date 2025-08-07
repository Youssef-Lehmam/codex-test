import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

const app = new Hono();

app.get('/healthz', (c) => c.json({ success: true }));

app.all('/api/*', async (c) => {
  const url = new URL(c.req.url);
  url.hostname = 'api.zenvex.dev';
  url.protocol = 'https';
  url.port = '';
  url.pathname = url.pathname.replace(/^\/api/, '');

  const init: RequestInit = {
    method: c.req.method,
    headers: c.req.headers,
  };
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    init.body = c.req.raw.body;
  }
  const res = await fetch(url.toString(), init);
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});

app.use('/*', serveStatic({ root: './dist' }));
app.get('*', serveStatic({ path: './dist/index.html' }));

export default app;
