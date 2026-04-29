function snackbox() {
  return {
    scrolled: false,
    mobileOpen: false,
    activeSection: 'beranda',
    isLoading: true,


    // Top navbar: multi-page navigation
    pageNav: [
      { label: 'Beranda', href: 'index.html', active: true },
      { label: 'List Paket', href: 'package.html', active: false },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // Left sidebar: scroll-to-section navigation
    sideNav: [
      { id: 'beranda', label: 'Beranda' },
      { id: 'keunggulan', label: 'Keunggulan' },
      { id: 'paket', label: 'Paket' },
      { id: 'cara-pesan', label: 'Cara Pesan' },
      { id: 'testimoni', label: 'Testimoni' },
      { id: 'faq', label: 'FAQ' },
    ],

    navItems: [
      { label: 'Beranda', href: '#beranda' },
      { label: 'Paket', href: '#paket' },
      { label: 'Cara Pesan', href: '#cara-pesan' },
      { label: 'Testimoni', href: '#testimoni' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Kontak', href: '#kontak' },
    ],
    stats: [
      { value: '10K+', label: 'Pelanggan Puas' },
      { value: '50K+', label: 'Box Terkirim' },
      { value: '4.9★', label: 'Rating Google' },
    ],
    features: [
      { icon:'fa-solid fa-cookie-bite', bg:'#FDE68A55', title:'Aneka Pilihan', desc:'Lebih dari 20 varian snackbox untuk berbagai selera dan kebutuhan acara Anda.' },
      { icon:'fa-solid fa-bolt', bg:'#FED7AA55', title:'Praktis & Cepat', desc:'Pesan mudah via Website atau WhatsApp. Proses cepat tanpa ribet.' },
      { icon:'fa-solid fa-trophy', bg:'#FECACA55', title:'Terpercaya', desc:'Dipercaya lebih dari 10.000 pelanggan dengan rating bintang 5 tertinggi.' },
      { icon:'fa-solid fa-comment-dots', bg:'#D1FAE555', title:'Layanan Ramah', desc:'Tim kami siap membantu Anda 7 hari seminggu dengan ramah dan responsif.' },
    ],
    trusts: [
      { icon:'fa-solid fa-wheat-awn', label:'Bahan Berkualitas', sub:'100% premium & higienis' },
      { icon:'fa-solid fa-gift', label:'Kemasan Eksklusif', sub:'Elegan & tahan banting' },
      { icon:'fa-solid fa-stopwatch', label:'Tepat Waktu', sub:'Garansi on-time delivery' },
      { icon:'fa-solid fa-face-smile', label:'Layanan Ramah', sub:'Respons < 1 jam' },
    ],
    products: [
      {
        img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
        name: 'Paket Mini Delight',
        desc: 'Cocok untuk gathering kecil. Isi 5 pcs camilan pilihan dalam kemasan cantik.',
        price: 'Rp 45.000',
        origPrice: 'Rp 55.000',
        badge: '🔥 Best Seller',
      },
      {
        img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=600&auto=format&fit=crop&q=80',
        name: 'Paket Standard Festive',
        desc: 'Pilihan sempurna untuk ulang tahun dan arisan. Isi 10 pcs premium snack.',
        price: 'Rp 85.000',
        origPrice: null,
        badge: '⭐ Populer',
      },
      {
        img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80',
        name: 'Paket Premium Royal',
        desc: 'Kemasan mewah eksklusif dengan 15 pcs artisan snack pilihan terbaik.',
        price: 'Rp 150.000',
        origPrice: 'Rp 180.000',
        badge: '👑 Premium',
      },
      {
        img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80',
        name: 'Paket Wedding Bliss',
        desc: 'Spesial untuk pernikahan & resepsi. Desain khusus & nama pasangan tersedia.',
        price: 'Rp 125.000',
        origPrice: null,
        badge: '💍 Wedding',
      },
      {
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        name: 'Paket Corporate',
        desc: 'Ideal untuk meeting, seminar, atau apresiasi karyawan. Minimal 50 box.',
        price: 'Mulai Rp 65.000',
        origPrice: null,
        badge: '🏢 Corporate',
      },
      {
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        name: 'Custom Order',
        desc: 'Buat snackbox sesuai keinginan Anda — isi, kemasan, dan desain bisa disesuaikan.',
        price: 'Harga Custom',
        origPrice: null,
        badge: '✨ Custom',
      },
    ],
    steps: [
      { icon:'fa-solid fa-mobile-screen', title:'Pilih Paket', desc:'Pilih paket snackbox yang sesuai kebutuhan Anda.' },
      { icon:'fa-solid fa-comment-dots', title:'Hubungi Kami', desc:'Konfirmasi pesanan via WhatsApp setelah checkout pesanan.' },
      { icon:'fa-solid fa-credit-card', title:'Lakukan Pembayaran', desc:'Transfer atau bayar via berbagai metode yang tersedia.' },
      { icon:'fa-solid fa-truck', title:'Terima Pesanan', desc:'Snackbox dikirim tepat waktu ke lokasi Anda.' },
    ],
    testimonials: [
      { quote: 'Snackbox-nya keren banget! Kemasan cantik, rasanya enak, tamu-tamu di acara pernikahan kami semua suka. Pasti pesan lagi!', name: 'Siti Rahayu', role: 'Event Organizer, Bandung', avatar: '../assets/images/face6.jpg' },
      { quote: 'Respon cepat, pengiriman tepat waktu, dan isinya memuaskan. Sudah 3 kali pesan untuk acara kantor, selalu puas!', name: 'Budi Santoso', role: 'HRD Manager, Bandung', avatar: '../assets/images/face16.jpg' },
      { quote: 'Paket custom-nya menarik banget. Tim SnackBox sangat membantu dan sabar. Hasilnya melebihi ekspektasi!', name: 'Dewi Lestari', role: 'Wedding Organizer, Cimahi', avatar: '../assets/images/face23.jpg' },
    ],
    faqs: [
      { q: 'Berapa minimum pemesanan?', a: 'Minimum pemesanan adalah 10 box untuk paket reguler. Untuk paket corporate, minimum 50 box dengan harga lebih terjangkau.', open: false },
      { q: 'Berapa lama proses pembuatan?', a: 'Proses pembuatan membutuhkan 2–3 hari kerja. Untuk pemesanan mendadak (H-1), harap hubungi kami terlebih dahulu untuk ketersediaan.', open: false },
      { q: 'Apakah bisa request isi atau kemasan custom?', a: 'Tentu! Kami menerima custom order untuk isi, kemasan, ribbon, kartu ucapan, hingga stiker nama. Hubungi kami untuk konsultasi gratis.', open: false },
      { q: 'Apakah ada garansi jika produk rusak saat pengiriman?', a: 'Ya, kami memberikan garansi penuh. Jika produk rusak akibat proses pengiriman, kami akan mengganti atau melakukan refund sesuai kebijakan.', open: false },
    ],

    scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    onScroll() {
      this.scrolled = window.scrollY > 40;
      // Detect active section for sidebar
      const sections = ['beranda','keunggulan','paket','cara-pesan','testimoni','faq'];
      let current = 'beranda';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.45) current = id;
        }
      }
      this.activeSection = current;
    },
    init() {
      // Custom Scroll Reveal (Lightweight replacement for AOS)
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            revealObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

      setTimeout(() => this.onScroll(), 100);
      setTimeout(() => { this.isLoading = false; }, 500);
    }
  }
}
