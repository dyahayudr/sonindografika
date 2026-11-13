const path = require('path');
const express = require('express');
const compression = require('compression');

const site = require('./data/site');
const { materials, products } = require('./data/products');
const articles = require('./data/articles');

const app = express();
const PORT = process.env.PORT || 3000;
// Cache-busting: berubah setiap kali server di-restart (deploy), aman dengan static maxAge 7 hari
const ASSET_VERSION = Date.now().toString(36);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');

app.use(compression());
// Header keamanan. Sumber luar yang diizinkan:
//  - Google Fonts (fonts.googleapis.com / fonts.gstatic.com)
//  - Google Maps embed di halaman Kontak (www.google.com / maps.google.com)
//  - Cloudflare: email-decode (/cdn-cgi, domain sendiri) + Web Analytics beacon (static.cloudflareinsights.com)
// style 'unsafe-inline' dibutuhkan karena template & SVG memakai atribut style="...".
// HSTS sengaja diatur di Cloudflare (SSL/TLS → Edge Certificates), bukan di sini.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': CSP,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  });
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

const nav = [
  { href: '/', label: 'Home' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/produk', label: 'Produk' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/kontak', label: 'Kontak' },
];

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.nav = nav;
  res.locals.currentPath = req.path;
  res.locals.formatDate = formatDate;
  res.locals.canonical = site.url + (req.path === '/' ? '' : req.path);
  res.locals.year = new Date().getFullYear();
  res.locals.assetVersion = ASSET_VERSION;
  res.locals.ogImage = site.url + '/img/og-image.png';
  next();
});

// Schema.org Organization / LocalBusiness (dipakai di semua halaman)
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: site.name,
  description: 'Produsen kantong plastik HD dan PP, polos maupun sablon custom, untuk area Jabodetabek.',
  url: site.url,
  logo: site.url + '/img/logo.svg',
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: site.areas.map((a) => ({ '@type': 'City', name: a })),
  sameAs: site.socials.map((s) => s.url),
  makesOffer: Object.values(materials).map((m) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Product', name: m.name + ' – ' + m.fullName },
  })),
};

app.get('/', (req, res) => {
  res.render('home', {
    title: 'SONINDOGRAFIKA – Produsen Plastik HD & PP Jabodetabek',
    description:
      'SONINDOGRAFIKA memproduksi kantong plastik HD dan PP, polos maupun sablon logo custom. Melayani Jakarta, Bogor, Depok, Tangerang, dan Bekasi.',
    products: products.slice(0, 4),
    materials,
    articles: articles.slice(0, 3),
    schemas: [orgSchema, { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url }],
  });
});

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    title: 'Tentang Kami – SONINDOGRAFIKA',
    description:
      'Kenali SONINDOGRAFIKA, produsen plastik HD dan PP untuk kebutuhan kemasan usaha di Jabodetabek. Kualitas terjaga, harga pabrik, dan pengiriman cepat.',
    schemas: [orgSchema],
  });
});

app.get('/produk', (req, res) => {
  res.render('produk', {
    title: 'Produk Plastik HD & PP – SONINDOGRAFIKA',
    description:
      'Katalog kantong plastik HD (kresek, plong, roll) dan plastik PP (bening, seal) serta sablon custom. Lihat kelebihan dan kegunaan tiap bahan.',
    products,
    materials,
    schemas: [
      orgSchema,
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.desc,
            image: site.url + p.image,
            material: materials[p.material].fullName,
            brand: { '@type': 'Brand', name: site.name },
          },
        })),
      },
    ],
  });
});

app.get('/artikel', (req, res) => {
  res.render('artikel', {
    title: 'Artikel & Panduan Plastik Kemasan – SONINDOGRAFIKA',
    description:
      'Panduan seputar plastik HD dan PP, ukuran & ketebalan, plastik sablon, hingga tips hemat packaging untuk UMKM di Jabodetabek.',
    articles,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Artikel SONINDOGRAFIKA',
        url: site.url + '/artikel',
        blogPost: articles.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.title,
          url: site.url + '/artikel/' + a.slug,
          datePublished: a.date,
        })),
      },
    ],
  });
});

app.get('/artikel/:slug', (req, res, next) => {
  const article = articles.find((a) => a.slug === req.params.slug);
  if (!article) return next();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const url = site.url + '/artikel/' + article.slug;
  res.render('artikel-detail', {
    title: article.title + ' – SONINDOGRAFIKA',
    description: article.description,
    ogType: 'article',
    article,
    related,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        abstract: article.summary,
        keywords: article.keywords.join(', '),
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: 'id-ID',
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: site.name, url: site.url },
        publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: site.url + '/img/logo.svg' } },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Artikel', item: site.url + '/artikel' },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ],
  });
});

app.get('/kontak', (req, res) => {
  res.render('kontak', {
    title: 'Kontak – SONINDOGRAFIKA',
    description:
      'Hubungi SONINDOGRAFIKA via WhatsApp, telepon, email, atau kunjungi alamat kami. Melayani pesanan plastik HD & PP se-Jabodetabek.',
    schemas: [orgSchema],
  });
});

// ---------- SEO / AIO helpers ----------
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...nav.map((n) => ({ loc: site.url + (n.href === '/' ? '' : n.href), lastmod: today })),
    ...articles.map((a) => ({ loc: `${site.url}/artikel/${a.slug}`, lastmod: a.date })),
  ];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n') +
      `\n</urlset>\n`
  );
});

// llms.txt – ringkasan situs untuk mesin AI (AIO)
app.get('/llms.txt', (req, res) => {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} adalah produsen kantong plastik bahan HD (HDPE) dan PP (polypropylene), polos maupun sablon logo custom, dengan fokus area layanan Jabodetabek (${site.areas.join(', ')}).`,
    '',
    `- Alamat: ${site.fullAddress}`,
    `- WhatsApp: ${site.whatsappDisplay}`,
    `- Email: ${site.email}`,
    '',
    '## Halaman',
    ...nav.map((n) => `- [${n.label}](${site.url}${n.href === '/' ? '' : n.href})`),
    '',
    '## Produk',
    ...products.map((p) => `- ${p.name} (${materials[p.material].name}): ${p.desc}`),
    '',
    '## Artikel',
    ...articles.map((a) => `- [${a.title}](${site.url}/artikel/${a.slug}): ${a.summary}`),
  ];
  res.type('text/plain').send(lines.join('\n') + '\n');
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman tidak ditemukan – SONINDOGRAFIKA', description: '', schemas: [], noindex: true });
});

module.exports = { app, nav, articles };

// Selalu listen, KECUALI saat dipakai build.js (STATIC_BUILD=1).
// Jangan pakai `require.main === module`: Hostinger (LiteSpeed lsnode/Passenger) memuat file ini
// lewat pembungkus, sehingga kondisi itu false dan server tidak pernah menyala (503).
if (!process.env.STATIC_BUILD) {
  app.listen(PORT, () => {
    console.log(`SONINDOGRAFIKA berjalan di http://localhost:${PORT}`);
  });
}
