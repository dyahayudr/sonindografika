# SONINDOGRAFIKA – Landing Page

Website company profile produsen plastik HD & PP (fokus Jabodetabek). Node.js + Express + EJS.

## Menjalankan

```bash
npm install
npm start          # http://localhost:3000  (ubah dengan env PORT)
npm run dev        # auto-restart saat file berubah
```

## Struktur

```
server.js              Route halaman + sitemap.xml, robots.txt, llms.txt, schema JSON-LD
data/site.js           ⚠️ Kontak, alamat, sosmed, angka statistik (masih PLACEHOLDER – wajib diganti)
data/products.js       Daftar produk + penjelasan bahan HD & PP
data/articles.js       Artikel SEO/AIO (tambah artikel baru cukup di file ini)
views/                 Template EJS (partials: head, header, footer, kartu produk, dll)
public/css/style.css   Tema ungu gelap
public/js/main.js      Menu mobile, animasi, filter produk, form → WhatsApp
public/img/            Ilustrasi SVG produk (ganti dengan foto asli)
```

## Sebelum go-live

1. Ganti semua data di `data/site.js` (nomor WA, telepon, email, alamat, `mapsQuery`, sosmed, `url` domain, angka statistik).
2. Ganti ilustrasi produk dengan foto asli: taruh di `public/img/` lalu ubah field `image` di `data/products.js`.
3. Tambahkan `public/img/og-image.png` (1200×630) untuk preview saat link dibagikan di WhatsApp/Facebook.
4. Daftarkan `https://domain-anda/sitemap.xml` ke Google Search Console, dan buat Google Business Profile.
