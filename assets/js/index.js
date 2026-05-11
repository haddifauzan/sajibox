/**
 * SajiBox - Home Page Logic (Alpine.js)
 */

const HOME_DATA = {
  // Navigation
  pageNav: [
    { label: 'Beranda', href: 'index.html', active: true },
    { label: 'List Paket', href: 'package.html', active: false },
    { label: 'Custom Pesanan', href: 'custom.html', active: false },
    { label: 'Tracking', href: 'tracking.html', active: false },
    { label: 'Tentang', href: 'about.html', active: false },
  ],

  sideNav: [
    { id: 'beranda', label: 'Beranda' },
    { id: 'keunggulan', label: 'Keunggulan' },
    { id: 'paket', label: 'Paket' },
    { id: 'cara-pesan', label: 'Cara Pesan' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'faq', label: 'FAQ' },
  ],

  // Marketing Data
  stats: [
    { value: '10K+', label: 'Pelanggan Puas' },
    { value: '50K+', label: 'Box Terkirim' },
    { value: '4.9★', label: 'Rating Google' },
  ],

  features: [
    { icon: 'fa-solid fa-wand-magic-sparkles', bg: '#FDE68A55', title: 'Bebas Custom', desc: 'Atur isian snack, desain kemasan, hingga kartu ucapan sesuka Anda.' },
    { icon: 'fa-solid fa-truck-fast', bg: '#FED7AA55', title: 'Pantau Pesanan', desc: 'Lacak status pembuatan hingga pengiriman secara real-time via website.' },
    { icon: 'fa-solid fa-cookie-bite', bg: '#FECACA55', title: 'Varian Lengkap', desc: 'Tersedia puluhan pilihan paket snackbox untuk berbagai kebutuhan acara.' },
    { icon: 'fa-solid fa-face-smile-beam', bg: '#D1FAE555', title: 'Layanan Ramah', desc: 'Konsultasi gratis 7 hari seminggu dengan tim kami yang responsif.' },
  ],

  trusts: [
    { icon: 'fa-solid fa-wheat-awn', label: 'Bahan Premium', sub: '100% higienis & lezat' },
    { icon: 'fa-solid fa-stopwatch', label: 'Tepat Waktu', sub: 'Garansi on-time delivery' },
    { icon: 'fa-solid fa-box-open', label: 'Kemasan Eksklusif', sub: 'Elegan & box kokoh' },
    { icon: 'fa-solid fa-headset', label: 'Layanan Personal', sub: 'Respons cepat & ramah' },
  ],

  steps: [
    { icon: 'fa-solid fa-mobile-screen', title: 'Pilih Paket', desc: 'Pilih paket snackbox yang sesuai kebutuhan Anda.' },
    { icon: 'fa-solid fa-comment-dots', title: 'Hubungi Kami', desc: 'Konfirmasi pesanan via WhatsApp setelah checkout pesanan.' },
    { icon: 'fa-solid fa-credit-card', title: 'Lakukan Pembayaran', desc: 'Transfer atau bayar via berbagai metode yang tersedia.' },
    { icon: 'fa-solid fa-truck', title: 'Terima Pesanan', desc: 'Snackbox dikirim tepat waktu ke lokasi Anda.' },
  ],

  testimonials: [
    { quote: 'Snackbox-nya keren banget! Kemasan cantik, rasanya enak, tamu-tamu di acara pernikahan kami semua suka. Pasti pesan lagi!', name: 'Siti Rahayu', role: 'Event Organizer, Bandung', avatar: 'assets/images/face6.jpg' },
    { quote: 'Respon cepat, pengiriman tepat waktu, and isinya memuaskan. Sudah 3 kali pesan untuk acara kantor, selalu puas!', name: 'Budi Santoso', role: 'HRD Manager, Bandung', avatar: 'assets/images/face16.jpg' },
    { quote: 'Paket custom-nya menarik banget. Tim SnackBox sangat membantu dan sabar. Hasilnya melebihi ekspektasi!', name: 'Dewi Lestari', role: 'Wedding Organizer, Cimahi', avatar: 'assets/images/face23.jpg' },
  ],

  faqs: [
    { q: 'Berapa minimum pemesanan di SajiBox?', a: 'Tidak ada minimum pesanan, pesan satu pun boleh. Kami juga melayani pesanan partai besar untuk acara kantor atau pernikahan dengan harga khusus.', open: false },
    { q: 'Apakah saya bisa memilih isi snack dan desain box sendiri?', a: 'Tentu saja! Anda bisa menggunakan fitur "Custom Pesanan" untuk memilih kombinasi snack, desain box, hingga isi pesan di kartu ucapan sesuai keinginan Anda.', open: false },
    { q: 'Kapan waktu paling lambat untuk melakukan pemesanan?', a: 'Kami menyarankan pemesanan dilakukan H-3 acara. Namun, kami juga menerima pemesanan kilat (H-1) untuk paket tertentu selama slot produksi masih tersedia.', open: false },
    { q: 'Bagaimana cara memantau status pesanan saya?', a: 'SajiBox menyediakan fitur "Tracking" real-time. Cukup masukkan Order ID Anda (contoh: SBXC-12345) untuk melihat progres pesanan mulai dari dapur hingga pengiriman.', open: false },
    { q: 'Area mana saja yang dijangkau oleh pengiriman SajiBox?', a: 'Saat ini kami fokus melayani area Cimahi, Bandung, dan sekitarnya untuk menjaga kesegaran produk. Kami menggunakan kurir khusus agar snackbox sampai dalam kondisi sempurna.', open: false },
  ]
};

function snackbox() {
  return {
    ...HOME_DATA,
    scrolled: false,
    mobileOpen: false,
    activeSection: 'beranda',
    isLoading: true,
    products: [],

    // Helpers
    formatPrice(val) {
      if (!val) return 'Rp 0';
      return 'Rp ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    viewDetail(code) {
      window.location.href = `package_detail.html?code=${code}`;
    },

    scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    onScroll() {
      this.scrolled = window.scrollY > 40;
      
      // Update active section based on scroll position
      const sectionIds = this.sideNav.map(s => s.id);
      let current = sectionIds[0];
      
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            current = id;
          }
        }
      }
      this.activeSection = current;
    },

    async init() {
      // Load products from PACKAGE_DATA (defined in external JS)
      if (typeof PACKAGE_DATA !== 'undefined') {
        this.products = [
          ...PACKAGE_DATA.slice(0, 5).map(p => ({
            code: p.code,
            img: p.image || 'assets/images/no-image.png',
            name: p.name,
            desc: p.description,
            price: this.formatPrice(p.price),
            badge: p.category
          })),
          {
            code: 'CUSTOM',
            img: 'assets/images/custom-pesanan.png',
            name: 'Custom Order',
            desc: 'Buat snackbox sesuai keinginan Anda — isi, kemasan, dan desain bisa disesuaikan.',
            price: 'Harga Custom',
            badge: 'Custom',
            isCustom: true
          }
        ];
      }

      // Initialize Animations (AOS)
      if (typeof AOS !== 'undefined') {
        AOS.init({
          once: true,
          duration: 700,
          offset: 60,
        });
      }

      // Initial scroll check and loading state
      setTimeout(() => this.onScroll(), 100);
      setTimeout(() => { this.isLoading = false; }, 500);
    }
  };
}

