function aboutPage() {
  return {
    scrolled: false,
    mobileOpen: false,

    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: false },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: true },
    ],

    values: [
      { icon: 'fa-solid fa-wheat-awn', bg: '#FDE68A55', title: 'Bahan Berkualitas', desc: 'Setiap camilan dibuat dari bahan-bahan pilihan yang 100% premium, segar, dan higienis.' },
      { icon: 'fa-solid fa-gift', bg: '#FED7AA55', title: 'Kemasan Eksklusif', desc: 'Desain kemasan elegan dan kokoh, siap untuk mempercantik momen spesial Anda.' },
      { icon: 'fa-solid fa-stopwatch', bg: '#FECACA55', title: 'Tepat Waktu', desc: 'Garansi pengiriman on-time — karena kami tahu waktu Anda sangat berharga.' },
      { icon: 'fa-solid fa-face-smile', bg: '#D1FAE555', title: 'Pelayanan Ramah', desc: 'Tim kami siap membantu Anda 7 hari seminggu dengan respons cepat dan penuh perhatian.' },
    ],

    aboutStats: [
      { value: '10K+', label: 'Pelanggan Puas' },
      { value: '50K+', label: 'Box Terkirim' },
      { value: '30+', label: 'Varian Menu' },
      { value: '4.9★', label: 'Rating Google' },
    ],

    onScroll() {
      this.scrolled = window.scrollY > 40;
    },

    init() {
      if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 700, offset: 60 });
      }
    }
  }
}
