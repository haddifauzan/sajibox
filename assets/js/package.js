// assets/js/package.js

// PACKAGE_DATA is now loaded from assets/data/data_package.js


/**
 * Alpine.js component for the Package List page
 */
function packagePage() {
  return {
    // ── UI State ──
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    activeCategory: 'Semua',

    // ── Data ──
    packages: PACKAGE_DATA,

    // ── Navigation ──
    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: true },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // ── Categories ──
    categories: [
      'Semua',
      'Saji Rapat',
      'Saji Tradisi',
      'Saji Manis-Gurih',
      'Saji Hantaran',
      'Saji Sehat',
    ],

    // ── Category icon map ──
    categoryIcons: {
      'Semua': 'fa-solid fa-grip',
      'Saji Rapat': 'fa-solid fa-briefcase',
      'Saji Tradisi': 'fa-solid fa-mortar-pestle',
      'Saji Manis-Gurih': 'fa-solid fa-scale-balanced',
      'Saji Hantaran': 'fa-solid fa-gift',
      'Saji Sehat': 'fa-solid fa-leaf',
    },

    // ── Init ──
    init() {
      setTimeout(() => { this.isLoading = false; }, 800);
    },

    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    // ── Filter packages by category ──
    filterPackages(category) {
      this.activeCategory = category;
    },

    get filteredPackages() {
      if (this.activeCategory === 'Semua') return this.packages;
      return this.packages.filter(p => p.category === this.activeCategory);
    },

    // ── Preview items (max 3) ──
    previewItems(pkg) {
      return pkg.items.slice(0, 3);
    },

    remainingItemsCount(pkg) {
      return Math.max(0, pkg.items.length - 3);
    },

    // ── Navigate to detail page ──
    viewDetail(pkg) {
      window.location.href = 'package_detail.html?code=' + encodeURIComponent(pkg.code);
    },

    // ── Box size color mapping ──
    boxColor(box) {
      if (box === 'Box S') return { bg: '#10B981', shadow: 'rgba(16,185,129,0.25)' };
      if (box === 'Box M') return { bg: '#3B82F6', shadow: 'rgba(59,130,246,0.25)' };
      if (box === 'Box L') return { bg: '#8B5CF6', shadow: 'rgba(139,92,246,0.25)' };
      return { bg: '#C2410C', shadow: 'rgba(194,65,12,0.25)' };
    },

    formatPrice(n) {
      return 'Rp ' + n.toLocaleString('id-ID');
    },
  };
}


/**
 * Alpine.js component for the Package Detail page
 */
function packageDetailPage() {
  return {
    // ── UI State ──
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    showLightbox: false,
    lightboxImg: '',
    lightboxTitle: '',
    currentStep: 1,
    totalSteps: 3,

    // ── Data ──
    pkg: null,
    boxQty: 1,
    notFound: false,
    summaryOpen: false,

    // ── Design & Card ──
    designs: [],
    cards: [],
    selectedDesign: null,
    selectedCard: null,
    cardMessage: '',

    // ── Navigation ──
    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: true },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // ── Category icon map ──
    categoryIcons: {
      'Saji Rapat': 'fa-solid fa-briefcase',
      'Saji Tradisi': 'fa-solid fa-mortar-pestle',
      'Saji Manis-Gurih': 'fa-solid fa-scale-balanced',
      'Saji Hantaran': 'fa-solid fa-gift',
      'Saji Sehat': 'fa-solid fa-leaf',
    },

    // ── Category subtitle map ──
    categorySubtitle: {
      'Saji Rapat': 'The Professional',
      'Saji Tradisi': 'The Nostalgic',
      'Saji Manis-Gurih': 'The Balanced',
      'Saji Hantaran': 'The Gift',
      'Saji Sehat': 'The Wellness',
    },

    // ── Init ──
    init() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        this.pkg = PACKAGE_DATA.find(p => p.code === code) || null;
      }

      if (!this.pkg) {
        this.notFound = true;
      }

      // Load designs (same as custom page)
      this.designs = [
        { id: 'design-1', name: 'Classic Kraft', price: 0, image: 'assets/images/design_box/design-1.png', description: 'Ceria dengan nuansa oranye khas SajiBox' },
        { id: 'design-2', name: 'Playful Pattern', price: 1000, image: 'assets/images/design_box/design-2.png', description: 'Motif fun & ramai untuk kesan santai' },
        { id: 'design-3', name: 'Modern Stripe', price: 1000, image: 'assets/images/design_box/design-3.png', description: 'Elegan dengan warna coklat premium' },
        { id: 'design-4', name: 'Festive Party', price: 1000, image: 'assets/images/design_box/design-4.png', description: 'Kalem dan natural dengan sentuhan hijau' },
        { id: 'design-5', name: 'Premium Gold', price: 1000, image: 'assets/images/design_box/design-5.png', description: 'Cerah & mencolok untuk acara spesial' },
      ];

      // Load cards
      this.cards = typeof CARDS_DATA !== 'undefined' ? CARDS_DATA : [];

      // Default selections
      this.selectedDesign = null;
      this.selectedCard = null;

      // Load progress if any
      this.loadProgress();

      // Setup watchers to save progress
      this.$watch('currentStep', () => this.saveProgress());
      this.$watch('boxQty', () => this.saveProgress());
      this.$watch('selectedDesign', () => this.saveProgress());
      this.$watch('selectedCard', () => this.saveProgress());
      this.$watch('cardMessage', () => this.saveProgress());

      setTimeout(() => { this.isLoading = false; }, 600);
    },

    saveProgress() {
      if (!this.pkg) return;
      const progress = {
        code: this.pkg.code,
        currentStep: this.currentStep,
        boxQty: this.boxQty,
        selectedDesignId: this.selectedDesign ? this.selectedDesign.id : null,
        selectedCardId: this.selectedCard ? this.selectedCard.id : null,
        cardMessage: this.cardMessage
      };
      localStorage.setItem('packageOrderProgress', JSON.stringify(progress));
    },

    loadProgress() {
      const saved = localStorage.getItem('packageOrderProgress');
      if (saved) {
        try {
          const progress = JSON.parse(saved);
          // Only load if it's the same package
          if (this.pkg && progress.code === this.pkg.code) {
            this.currentStep = progress.currentStep || 1;
            this.boxQty = progress.boxQty || 1;
            if (progress.selectedDesignId) {
              this.selectedDesign = this.designs.find(d => d.id === progress.selectedDesignId) || null;
            }
            if (progress.selectedCardId) {
              this.selectedCard = this.cards.find(c => c.id === progress.selectedCardId) || null;
            }
            if (progress.cardMessage !== undefined) {
              this.cardMessage = progress.cardMessage;
            }
          }
        } catch (e) {
          console.error("Failed to load package order progress", e);
        }
      }
    },

    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    // ── Wizard Navigation ──
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    setStep(step) {
      if (this.canGoToStep(step)) {
        this.currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    get isAllStepsComplete() {
      return this.isStepComplete(2) && this.isStepComplete(3);
    },

    isStepComplete(step) {
      if (step === 1) return true;
      if (step === 2) return this.selectedDesign !== null;
      if (step === 3) {
        if (!this.selectedCard) return false;
        if (this.selectedCard.id === 'card-none') return true;
        return this.cardMessage.trim().length > 0;
      }
      return false;
    },

    canGoToStep(step) {
      if (step === this.currentStep) return true;
      if (step < this.currentStep) return true;
      if (step === this.currentStep + 1) return this.isStepComplete(this.currentStep);
      // Allow jumping to any step that is already complete
      if (this.isStepComplete(step)) return true;
      return false;
    },

    lightboxCategory: '',
    // ...
    // ── Lightbox ──
    openLightbox(img, title, category = 'Preview Desain Box') {
      this.lightboxImg = img;
      this.lightboxTitle = title;
      this.lightboxCategory = category;
      this.showLightbox = true;
    },
    closeLightbox() {
      this.showLightbox = false;
    },

    // ── Qty controls ──
    increaseBoxQty() {
      if (this.boxQty < 999) this.boxQty++;
    },

    decreaseBoxQty() {
      if (this.boxQty > 1) this.boxQty--;
    },

    // ── Design & Card selection ──
    selectDesign(design) {
      this.selectedDesign = design;
    },

    selectCard(card) {
      this.selectedCard = card;
      if (card.id === 'card-none') this.cardMessage = '';
    },

    get cardMessageCount() {
      return this.cardMessage.length;
    },

    // ── Separate foods and drinks ──
    get foodItems() {
      if (!this.pkg) return [];
      return this.pkg.items.filter(item => !item.toLowerCase().includes('air mineral'));
    },

    get drinkItems() {
      if (!this.pkg) return [];
      return this.pkg.items.filter(item => item.toLowerCase().includes('air mineral'));
    },

    // ── Pricing ──
    get designPrice() {
      return this.selectedDesign ? this.selectedDesign.price : 0;
    },

    get cardPrice() {
      return this.selectedCard ? this.selectedCard.price : 0;
    },

    get pkgPrice() {
      return this.pkg ? this.pkg.price : 0;
    },

    get pricePerBox() {
      return this.pkgPrice + this.designPrice + this.cardPrice;
    },

    get totalPrice() {
      return this.pricePerBox * this.boxQty;
    },

    // ── Related packages (same category, excluding current) ──
    get relatedPackages() {
      if (!this.pkg) return [];
      return PACKAGE_DATA.filter(p => p.category === this.pkg.category && p.code !== this.pkg.code);
    },

    // ── Box size color mapping ──
    boxColor(box) {
      if (box === 'Box S') return { bg: '#10B981', shadow: 'rgba(16,185,129,0.25)', label: 'Small' };
      if (box === 'Box M') return { bg: '#3B82F6', shadow: 'rgba(59,130,246,0.25)', label: 'Medium' };
      if (box === 'Box L') return { bg: '#8B5CF6', shadow: 'rgba(139,92,246,0.25)', label: 'Large' };
      return { bg: '#C2410C', shadow: 'rgba(194,65,12,0.25)', label: '' };
    },

    // ── Helpers ──
    formatPrice(n) {
      return 'Rp ' + n.toLocaleString('id-ID');
    },

    // ── Checkout ──
    checkout() {
      if (!this.pkg) return;

      const order = {
        type: 'package',
        package: {
          code: this.pkg.code,
          name: this.pkg.name,
          items: this.pkg.items,
          box: this.pkg.box,
          image: this.pkg.image,
          price: this.pkg.price
        },
        boxQty: this.boxQty,
        design: {
          name: this.selectedDesign?.name || null,
          price: this.designPrice
        },
        card: {
          name: this.selectedCard?.id !== 'card-none' ? this.selectedCard?.name : null,
          message: this.cardMessage || null,
          price: this.cardPrice
        },
        pricePerBox: this.pricePerBox,
        totalPrice: this.totalPrice
      };

      localStorage.setItem('order', JSON.stringify(order));
      window.location.href = 'checkout.html';
    },
  };
}


