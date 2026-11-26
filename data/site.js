// =====================================================================
//  KONFIGURASI PERUSAHAAN
//  Semua data kontak & angka di bawah ini adalah CONTOH / PLACEHOLDER.
//  Ganti dengan data asli LIMA PLASTIK sebelum website dipublikasikan.
// =====================================================================

const site = {
  name: 'LIMA PLASTIK',
  tagline: 'PLASTIK LAUNDRY MURAH, PELUANG UNTUNG MELIMPAH!',
  // Domain utama (dipakai untuk canonical, sitemap, schema). Bisa ditimpa lewat env SITE_URL.
  url: (process.env.SITE_URL || 'https://sonindografika.com').replace(/\/$/, ''),
  locale: 'id_ID',

  // Kontak (GANTI semua dengan data asli)
  whatsapp: '6285111393611', // format internasional tanpa "+" dan tanpa spasi → wa.me/6285111393611
  whatsappDisplay: '+62 851 1139 3611',
  phone: '+62 851 1139 3611',
  email: 'admin@limaplastik.com',
  address: {
    street: 'Jl. Notosuman, RT.002/RW.005, Dusun II, Singopuran, Kec. Kartasura',
    locality: 'Kabupaten Sukoharjo',
    region: 'Jawa Tengah',
    postalCode: '57164',
    country: 'ID',
  },
  // Titik peta (koordinat tempat "LIMA PLASTIK" di Google Maps) untuk embed di halaman Kontak
  mapsQuery: '-7.5493543,110.746806',
  geo: { lat: -7.5493543, lng: 110.746806 },
  // Link "Buka di Google Maps"
  mapsUrl: 'https://maps.app.goo.gl/joNv26CNAwLaZeGb9',
  hours: [
    { days: 'Senin – Jumat', time: '09.00 – 17.00' },
    { days: 'Sabtu', time: '09.00 – 14.00' },
    { days: 'Minggu & Tanggal Merah', time: 'Tutup' },
  ],

  socials: [
    { name: 'Instagram', handle: '@sonindografika', url: 'https://instagram.com/sonindografika', icon: 'instagram' },
    { name: 'Facebook', handle: 'LIMA PLASTIK', url: 'https://facebook.com/sonindografika', icon: 'facebook' },
    { name: 'TikTok', handle: '@sonindografika', url: 'https://tiktok.com/@sonindografika', icon: 'tiktok' },
    { name: 'YouTube', handle: 'LIMA PLASTIK', url: 'https://youtube.com/@sonindografika', icon: 'youtube' },
    { name: 'Tokopedia', handle: 'LIMA PLASTIK', url: 'https://tokopedia.com/sonindografika', icon: 'shop' },
  ],

  // Angka-angka di beranda (GANTI sesuai fakta perusahaan)
  stats: [
    { value: '10+', label: 'Tahun pengalaman' },
    { value: '500+', label: 'Klien usaha' },
    { value: '24 jam', label: 'Respon penawaran' },
  ],

  areas: ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi'],
};

site.whatsappLink = (text = 'Halo LIMA PLASTIK, saya ingin minta penawaran plastik.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

site.fullAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

module.exports = site;
