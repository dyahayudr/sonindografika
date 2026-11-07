// Data produk. Ganti `image` dengan foto asli (mis. /img/produk/kresek-hd.jpg) bila sudah ada.

const materials = {
  hd: {
    key: 'hd',
    name: 'Plastik HD',
    fullName: 'HDPE (High Density Polyethylene)',
    summary:
      'Plastik HD bertekstur doff/buram, ringan, kaku saat diremas, dan sangat kuat menahan beban meski tipis. Pilihan utama untuk kantong belanja dan kemasan yang butuh daya angkut tinggi.',
    advantages: [
      'Kuat menahan beban berat walau ketebalannya tipis',
      'Tahan sobek dan tidak mudah melar',
      'Tahan terhadap minyak, air, dan banyak bahan kimia ringan',
      'Permukaan doff, nyaman dicetak sablon logo',
      'Lebih ekonomis per lembar untuk kebutuhan volume besar',
      'Dapat didaur ulang (kode daur ulang 2)',
    ],
    uses: [
      'Kantong kresek belanja minimarket, toko, dan pasar',
      'Kantong laundry dan kantong pakaian',
      'Plastik sampah dan kantong roll',
      'Kemasan makanan kering & bahan pokok (beras, gula, tepung)',
      'Kantong apotek, toko bangunan, dan ekspedisi',
    ],
  },
  pp: {
    key: 'pp',
    name: 'Plastik PP',
    fullName: 'PP (Polypropylene)',
    summary:
      'Plastik PP bening, jernih, dan mengkilap sehingga isi kemasan terlihat jelas dan tampak premium. Lebih tahan panas dibanding plastik PE dan umum dipakai sebagai kemasan makanan.',
    advantages: [
      'Sangat bening dan mengkilap — produk terlihat menarik',
      'Lebih tahan panas dibanding plastik PE',
      'Tersedia bahan food grade untuk kemasan makanan',
      'Kaku dan rapi, kemasan tidak mudah kusut',
      'Mudah di-seal panas sehingga kemasan rapat',
      'Dapat didaur ulang (kode daur ulang 5)',
    ],
    uses: [
      'Kemasan roti, kue, snack, dan keripik',
      'Kemasan es, minuman, dan makanan siap saji',
      'Pembungkus pakaian, kain, dan aksesoris',
      'Kemasan souvenir, hampers, dan produk display',
      'Kemasan alat tulis dan produk retail',
    ],
  },
};

const products = [
  {
    slug: 'kantong-kresek-hd',
    name: 'Kantong Kresek HD',
    material: 'hd',
    image: '/img/produk-kresek-hd.svg',
    desc: 'Kantong model "T-shirt bag" yang kuat untuk belanja, toko, dan minimarket.',
    specs: ['Polos / sablon', 'Banyak pilihan warna', 'Ukuran 15 – 60 cm'],
  },
  {
    slug: 'plastik-hd-plong',
    name: 'Plastik HD Plong',
    material: 'hd',
    image: '/img/produk-plong-hd.svg',
    desc: 'Kantong dengan pegangan lubang (die-cut) yang rapi untuk butik, apotek, dan event.',
    specs: ['Pegangan plong', 'Cocok untuk branding', 'Sablon 1–4 warna'],
  },
  {
    slug: 'plastik-hd-roll',
    name: 'Plastik HD Roll',
    material: 'hd',
    image: '/img/produk-roll-hd.svg',
    desc: 'Kantong roll sobek untuk supermarket, buah, sayur, dan plastik sampah.',
    specs: ['Sistem roll', 'Mudah disobek', 'Hemat tempat'],
  },
  {
    slug: 'plastik-pp-bening',
    name: 'Plastik PP Bening',
    material: 'pp',
    image: '/img/produk-pp-bening.svg',
    desc: 'Kantong bening jernih untuk roti, kue, snack, dan makanan.',
    specs: ['Food grade', 'Super jernih', 'Banyak ukuran'],
  },
  {
    slug: 'plastik-pp-seal',
    name: 'Plastik PP Seal / Lem',
    material: 'pp',
    image: '/img/produk-pp-seal.svg',
    desc: 'Kantong PP dengan perekat atau siap seal untuk pakaian dan produk retail.',
    specs: ['Perekat / seal panas', 'Kemasan rapat', 'Tampilan premium'],
  },
  {
    slug: 'plastik-custom-sablon',
    name: 'Custom Sablon Logo',
    material: 'hd',
    image: '/img/produk-custom.svg',
    desc: 'Cetak logo dan identitas brand Anda di kantong HD maupun PP.',
    specs: ['Desain gratis*', 'Ukuran custom', 'Untuk HD & PP'],
  },
];

module.exports = { materials, products };
