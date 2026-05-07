const PACKAGE_DATA = [
  // ── Saji Rapat (The Professional) ── Kode: RPT
  {
    code: 'RPT-01',
    name: 'Saji Briefing',
    category: 'Saji Rapat',
    categoryCode: 'RPT',
    description: 'Paket ringkas dan praktis untuk meeting singkat atau briefing pagi. Berisi camilan ringan yang pas dinikmati sambil berdiskusi, lengkap dengan air mineral gelas.',
    items: ['Risol Mayo', 'Kue Sus', 'Sosis Solo', 'Air Mineral Gelas'],
    box: 'Box S',
    image: 'assets/images/paketan/RPT-01.jpg',
    price: 7000
  },
  {
    code: 'RPT-02',
    name: 'Saji Workshop',
    category: 'Saji Rapat',
    categoryCode: 'RPT',
    description: 'Ideal untuk workshop atau seminar setengah hari. Kombinasi camilan gurih dan manis yang mengenyangkan, cocok untuk mengisi energi peserta selama sesi berlangsung.',
    items: ['Pastel Sayur', 'Brownies Potong', 'Lemper Ayam', 'Tahu Bakso', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/RPT-02.png',
    price: 9000
  },
  {
    code: 'RPT-03',
    name: 'Saji Eksekutif',
    category: 'Saji Rapat',
    categoryCode: 'RPT',
    description: 'Paket premium untuk rapat direksi atau pertemuan penting. Pilihan menu eksklusif dengan sentuhan elegan, menjadikan setiap pertemuan terasa lebih istimewa.',
    items: ['Macaroni Schotel', 'Pie Buah', 'Risol Mayo', 'Lemper Ayam', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/RPT-03.png',
    price: 12000
  },

  // ── Saji Tradisi (The Nostalgic) ── Kode: TRD
  {
    code: 'TRD-01',
    name: 'Saji Klasik',
    category: 'Saji Tradisi',
    categoryCode: 'TRD',
    description: 'Kumpulan jajanan pasar legendaris yang membangkitkan nostalgia. Cocok untuk acara pengajian, arisan RT, atau kumpul keluarga yang ingin nuansa tradisional.',
    items: ['Nagasari', 'Onde-Onde', 'Dadar Gulung', 'Air Mineral Gelas'],
    box: 'Box S',
    image: 'assets/images/paketan/TRD-01.png',
    price: 4000
  },
  {
    code: 'TRD-02',
    name: 'Saji Arisan',
    category: 'Saji Tradisi',
    categoryCode: 'TRD',
    description: 'Paket spesial arisan dengan pilihan kue tradisional yang beragam. Setiap gigitan menghadirkan cita rasa otentik warisan Nusantara yang selalu dirindukan.',
    items: ['Kue Ku', 'Klepon', 'Lumpia Rebung', 'Putu Ayu', 'Air Mineral Gelas'],
    box: 'Box M',
    image: 'assets/images/paketan/TRD-02.png',
    price: 7000
  },
  {
    code: 'TRD-03',
    name: 'Saji Syukuran',
    category: 'Saji Tradisi',
    categoryCode: 'TRD',
    description: 'Paket lengkap untuk acara syukuran, selametan, atau tasyakuran. Berisi aneka jajanan tradisional berlimpah yang cocok dibagikan kepada tetangga dan kerabat.',
    items: ['Arem-Arem Ayam', 'Bika Ambon Mini', 'Onde-Onde', 'Pastel Sayur', 'Sosis Solo', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/TRD-03.png',
    price: 11000
  },

  // ── Saji Manis-Gurih (The Balanced) ── Kode: MNG
  {
    code: 'MNG-01',
    name: 'Saji Harmoni',
    category: 'Saji Manis-Gurih',
    categoryCode: 'MNG',
    description: 'Perpaduan sempurna antara camilan manis dan gurih dalam satu box. Cocok untuk coffee break atau teman ngobrol santai dengan rasa yang seimbang.',
    items: ['Risol Mayo', 'Brownies Potong', 'Tahu Bakso', 'Air Mineral Gelas'],
    box: 'Box S',
    image: 'assets/images/paketan/MNG-01.png',
    price: 7000
  },
  {
    code: 'MNG-02',
    name: 'Saji Kontras',
    category: 'Saji Manis-Gurih',
    categoryCode: 'MNG',
    description: 'Kontras rasa yang memanjakan lidah — dari gurihnya martabak hingga manisnya pie buah. Paket ini dirancang untuk memberikan pengalaman rasa yang tak terlupakan.',
    items: ['Martabak Telur Mini', 'Pie Buah', 'Sosis Solo', 'Kue Lumpur', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/MNG-02.png',
    price: 10000
  },
  {
    code: 'MNG-03',
    name: 'Saji Simfoni',
    category: 'Saji Manis-Gurih',
    categoryCode: 'MNG',
    description: 'Simfoni rasa dalam satu kemasan — enam jenis camilan manis dan gurih yang saling melengkapi. Paket terlengkap untuk acara yang butuh variasi menu berlimpah.',
    items: ['Risol Mayo', 'Brownies Potong', 'Pie Buah', 'Lemper Ayam', 'Martabak Mini', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/MNG-03.png',
    price: 13000
  },

  // ── Saji Hantaran (The Gift) ── Kode: HTR
  {
    code: 'HTR-01',
    name: 'Saji Bingkisan',
    category: 'Saji Hantaran',
    categoryCode: 'HTR',
    description: 'Bingkisan istimewa berisi camilan favorit masing-masing 2 pcs. Cocok untuk hadiah, buah tangan, atau oleh-oleh yang mengesankan untuk orang tersayang.',
    items: ['Risol Mayo (2 pcs)', 'Lemper (2 pcs)', 'Sosis Solo (2 pcs)', 'Pie Buah (2 pcs)', 'Brownies (2 pcs)', 'Air Mineral Botol Kecil'],
    box: 'Box L',
    image: 'assets/images/paketan/HTR-01.png',
    price: 22000
  },
  {
    code: 'HTR-02',
    name: 'Saji Hampers',
    category: 'Saji Hantaran',
    categoryCode: 'HTR',
    description: 'Hampers dengan 11 jenis snack pilihan berbeda yang dikemas secara eksklusif sebagai hadiah premium untuk momen-momen spesial seperti lebaran atau pernikahan.',
    items: ['Risol Mayo', 'Pie Buah', 'Macaroni Schotel Mini', 'Bika Ambon Mini', 'Kue Sus', 'Brownies Potong', 'Lemper Ayam', 'Sosis Solo', 'Kue Ku (Kue Thok)', 'Dadar Gulung', 'Klepon', 'Air Mineral Botol Kecil'],
    box: 'Box L',
    image: 'assets/images/paketan/HTR-02.png',
    price: 23000
  },
  {
    code: 'HTR-03',
    name: 'Saji Mahkota',
    category: 'Saji Hantaran',
    categoryCode: 'HTR',
    description: 'Paket hantaran paling lengkap dan mewah dari SajiBox. Berisi beragam camilan premium dalam porsi berlimpah — sempurna sebagai seserahan atau hadiah kehormatan.',
    items: ['Macaroni Schotel (2)', 'Pie Buah (2)', 'Bika Ambon Mini (2)', 'Risol Mayo (2)', 'Lemper Ayam (2)', 'Sosis Solo (1)', 'Air Mineral Botol Kecil'],
    box: 'Box L',
    image: 'assets/images/paketan/HTR-03.png',
    price: 26000
  },

  // ── Saji Sehat (The Wellness) ── Kode: WLN
  {
    code: 'WLN-01',
    name: 'Saji Bugar',
    category: 'Saji Sehat',
    categoryCode: 'WLN',
    description: 'Pilihan camilan yang lebih sehat dan ringan untuk gaya hidup aktif. Terbuat dari bahan-bahan alami tanpa pengawet berlebih, cocok untuk acara olahraga atau wellness.',
    items: ['Nagasari', 'Arem-Arem Ayam', 'Putu Ayu', 'Air Mineral Gelas'],
    box: 'Box S',
    image: 'assets/images/paketan/WLN-01.png',
    price: 6000
  },
  {
    code: 'WLN-02',
    name: 'Saji Nutrisi',
    category: 'Saji Sehat',
    categoryCode: 'WLN',
    description: 'Paket bernutrisi dengan dominasi bahan alami dan buah-buahan segar. Ideal untuk acara yang mengedepankan pola makan seimbang tanpa mengorbankan cita rasa.',
    items: ['Pie Buah', 'Nagasari', 'Klepon', 'Dadar Gulung', 'Air Mineral Gelas'],
    box: 'Box M',
    image: 'assets/images/paketan/WLN-02.png',
    price: 7000
  },
  {
    code: 'WLN-03',
    name: 'Saji Alami',
    category: 'Saji Sehat',
    categoryCode: 'WLN',
    description: 'Camilan berbahan dasar alami dengan proses tradisional — dari bika ambon yang lembut hingga arem-arem ayam yang mengenyangkan. Sehat, alami, dan tetap lezat.',
    items: ['Bika Ambon', 'Kue Lumpur', 'Arem-Arem Ayam', 'Putu Ayu', 'Air Mineral Botol Kecil'],
    box: 'Box M',
    image: 'assets/images/paketan/WLN-03.png',
    price: 10000
  },
];
