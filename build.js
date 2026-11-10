// Membuat versi statis website ke folder dist/ untuk GitHub Pages.
//   BASE_PATH  : sub-path situs, mis. "/sonindografika" (kosongkan untuk domain sendiri)
//   SITE_URL   : URL lengkap situs, dipakai untuk canonical, sitemap, dan schema
// Contoh: BASE_PATH=/sonindografika SITE_URL=https://user.github.io/sonindografika npm run build

const fs = require('fs');
const path = require('path');

const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');
process.env.STATIC_BUILD = '1'; // cegah server.js membuka port sendiri
const { app, nav, articles } = require('./server');

const DIST = path.join(__dirname, 'dist');
const PUBLIC = path.join(__dirname, 'public');

const pages = [
  ...nav.map((n) => n.href),
  ...articles.map((a) => `/artikel/${a.slug}`),
];
const files = ['/sitemap.xml', '/robots.txt', '/llms.txt'];

// Prefix root-relative links ("/produk", "/css/...") with BASE, leave "//cdn" and absolute URLs alone.
const withBase = (html) =>
  BASE ? html.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`) : html;

const outFile = (route) =>
  route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.cpSync(PUBLIC, DIST, { recursive: true });

  const server = app.listen(0);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const get = async (route) => {
    const res = await fetch(origin + route);
    return { status: res.status, body: await res.text() };
  };

  try {
    for (const route of pages) {
      const { status, body } = await get(route);
      if (status !== 200) throw new Error(`${route} -> HTTP ${status}`);
      write(outFile(route), withBase(body));
      console.log('  page', route);
    }
    for (const route of files) {
      const { body } = await get(route);
      write(path.join(DIST, route), body);
      console.log('  file', route);
    }
    const notFound = await get('/__404__');
    write(path.join(DIST, '404.html'), withBase(notFound.body));
    write(path.join(DIST, '.nojekyll'), '');
    console.log(`\nSelesai: ${pages.length} halaman -> dist/ (BASE_PATH="${BASE || '/'}")`);
  } finally {
    server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
