// =====================================================================
//  KONFIGURASI PERUSAHAAN
//  Semua data kontak & angka di bawah ini adalah CONTOH / PLACEHOLDER.
//  Ganti dengan data asli SONINDOGRAFIKA sebelum website dipublikasikan.
// =====================================================================

const site = {
  name: 'SONINDOGRAFIKA',
  tagline: 'Produsen Plastik HD & PP untuk Jabodetabek',
  // Domain utama (dipakai untuk canonical, sitemap, schema). Bisa ditimpa lewat env SITE_URL.
  url: (process.env.SITE_URL || 'https://sonindografika.com').replace(/\/$/, ''),
  locale: 'id_ID',

  // Kontak (GANTI semua dengan data asli)
  whatsapp: '6281200000000', // format internasional tanpa "+" dan tanpa spasi
  whatsappDisplay: '+62 812-0000-0000',
  phone: '+62 21 0000 0000',
  email: 'info@sonindografika.com',
  address: {
    street: 'Jl. Contoh Industri No. 1',
    locality: 'Kota Tangerang',
    region: 'Banten',
    postalCode: '15000',
    country: 'ID',
  },
  // Teks yang dipakai untuk peta Google Maps (bisa alamat lengkap / nama tempat)
  mapsQuery: 'Tangerang, Banten',
  hours: [
    { days: 'Senin – Jumat', time: '08.00 – 17.00' },
    { days: 'Sabtu', time: '08.00 – 14.00' },
    { days: 'Minggu & Libur', time: 'Tutup' },
  ],

  socials: [
    { name: 'Instagram', handle: '@sonindografika', url: 'https://instagram.com/sonindografika', icon: 'instagram' },
    { name: 'Facebook', handle: 'SONINDOGRAFIKA', url: 'https://facebook.com/sonindografika', icon: 'facebook' },
    { name: 'TikTok', handle: '@sonindografika', url: 'https://tiktok.com/@sonindografika', icon: 'tiktok' },
    { name: 'YouTube', handle: 'SONINDOGRAFIKA', url: 'https://youtube.com/@sonindografika', icon: 'youtube' },
    { name: 'Tokopedia', handle: 'SONINDOGRAFIKA', url: 'https://tokopedia.com/sonindografika', icon: 'shop' },
  ],

  // Angka-angka di beranda (GANTI sesuai fakta perusahaan)
  stats: [
    { value: '10+', label: 'Tahun pengalaman' },
    { value: '500+', label: 'Klien usaha' },
    { value: '24 jam', label: 'Respon penawaran' },
  ],

  areas: ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi'],
};

site.whatsappLink = (text = 'Halo SONINDOGRAFIKA, saya ingin minta penawaran plastik.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

site.fullAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

module.exports = site;
