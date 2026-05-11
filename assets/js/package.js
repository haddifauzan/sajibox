/**
 * SajiBox - Package Logic (Alpine.js)
 * Handles both Package Listing and Package Detail pages.
 */

const PACKAGE_CONSTANTS = {
  // Navigation
  pageNav: [
    { label: 'Beranda', href: 'index.html', active: false },
    { label: 'List Paket', href: 'package.html', active: true },
    { label: 'Custom Pesanan', href: 'custom.html', active: false },
    { label: 'Tracking', href: 'tracking.html', active: false },
    { label: 'Tentang', href: 'about.html', active: false },
  ],

  // Categories & Icons
  categories: [
    'Semua',
    'Saji Rapat',
    'Saji Tradisi',
    'Saji Manis-Gurih',
    'Saji Hantaran',
    'Saji Sehat',
  ],

  categoryIcons: {
    'Semua': 'fa-solid fa-grip',
    'Saji Rapat': 'fa-solid fa-briefcase',
    'Saji Tradisi': 'fa-solid fa-mortar-pestle',
    'Saji Manis-Gurih': 'fa-solid fa-scale-balanced',
    'Saji Hantaran': 'fa-solid fa-gift',
    'Saji Sehat': 'fa-solid fa-leaf',
  },

  categorySubtitles: {
    'Saji Rapat': 'The Professional',
    'Saji Tradisi': 'The Nostalgic',
    'Saji Manis-Gurih': 'The Balanced',
    'Saji Hantaran': 'The Gift',
    'Saji Sehat': 'The Wellness',
  },

  // Box Size Mapping
  boxConfigs: {
    'Box S': { bg: '#10B981', shadow: 'rgba(16,185,129,0.25)', label: 'Small' },
    'Box M': { bg: '#3B82F6', shadow: 'rgba(59,130,246,0.25)', label: 'Medium' },
    'Box L': { bg: '#8B5CF6', shadow: 'rgba(139,92,246,0.25)', label: 'Large' },
    'default': { bg: '#C2410C', shadow: 'rgba(194,65,12,0.25)', label: '' }
  },

  // Shared Data
  designs: [
    { id: 'design-1', name: 'Classic Kraft', price: 0, image: 'assets/images/design_box/design-1.png', description: 'Ceria dengan nuansa oranye khas SajiBox' },
    { id: 'design-2', name: 'Playful Pattern', price: 1000, image: 'assets/images/design_box/design-2.png', description: 'Motif fun & ramai untuk kesan santai' },
    { id: 'design-3', name: 'Modern Stripe', price: 1000, image: 'assets/images/design_box/design-3.png', description: 'Elegan dengan warna coklat premium' },
    { id: 'design-4', name: 'Festive Party', price: 1000, image: 'assets/images/design_box/design-4.png', description: 'Kalem dan natural dengan sentuhan hijau' },
    { id: 'design-5', name: 'Premium Gold', price: 1000, image: 'assets/images/design_box/design-5.png', description: 'Cerah & mencolok untuk acara spesial' },
  ]
};

// ── COMPONENT: PACKAGE LIST PAGE ──

function packagePage() {
  return {
    ...PACKAGE_CONSTANTS,
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    activeCategory: 'Semua',
    packages: typeof PACKAGE_DATA !== 'undefined' ? PACKAGE_DATA : [],

    // Init
    init() {
      setTimeout(() => { this.isLoading = false; }, 800);
    },

    // UI Helpers
    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    formatPrice(n) {
      return 'Rp ' + n.toLocaleString('id-ID');
    },

    boxStyle(box) {
      return this.boxConfigs[box] || this.boxConfigs.default;
    },

    // Filtering
    filterPackages(category) {
      this.activeCategory = category;
    },

    get filteredPackages() {
      if (this.activeCategory === 'Semua') return this.packages;
      return this.packages.filter(p => p.category === this.activeCategory);
    },

    // Preview Helpers
    previewItems(pkg) {
      return pkg.items.slice(0, 3);
    },

    remainingItemsCount(pkg) {
      return Math.max(0, pkg.items.length - 3);
    },

    // Navigation
    viewDetail(pkg) {
      window.location.href = 'package_detail.html?code=' + encodeURIComponent(pkg.code);
    }
  };
}

// ── COMPONENT: PACKAGE DETAIL PAGE ──

function packageDetailPage() {
  return {
    ...PACKAGE_CONSTANTS,
    // UI State
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    showLightbox: false,
    lightboxImg: '',
    lightboxTitle: '',
    lightboxCategory: '',
    currentStep: 1,
    totalSteps: 3,
    summaryOpen: false,

    // Order Data
    pkg: null,
    boxQty: 1,
    notFound: false,
    selectedDesign: null,
    selectedCard: null,
    cardMessage: '',
    cards: typeof CARDS_DATA !== 'undefined' ? CARDS_DATA : [],

    // Lifecycle
    init() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        this.pkg = PACKAGE_DATA.find(p => p.code === code) || null;
      }

      if (!this.pkg) {
        this.notFound = true;
      }

      // Load progress from localStorage
      this.loadProgress();

      // Setup watchers to save progress automatically
      ['currentStep', 'boxQty', 'selectedDesign', 'selectedCard', 'cardMessage'].forEach(prop => {
        this.$watch(prop, () => this.saveProgress());
      });

      setTimeout(() => { this.isLoading = false; }, 600);
    },

    // UI Helpers
    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    formatPrice(n) {
      return 'Rp ' + n.toLocaleString('id-ID');
    },

    boxStyle(box) {
      return this.boxConfigs[box] || this.boxConfigs.default;
    },

    // Wizard Controls
    setStep(step) {
      if (this.canGoToStep(step)) {
        this.currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

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

    isStepComplete(step) {
      if (step === 1) return true;
      if (step === 2) return !!this.selectedDesign;
      if (step === 3) {
        if (!this.selectedCard) return false;
        if (this.selectedCard.id === 'card-none') return true;
        return this.cardMessage.trim().length > 0;
      }
      return false;
    },

    canGoToStep(step) {
      if (step <= this.currentStep) return true;
      return this.isStepComplete(step - 1);
    },

    // Persistence
    saveProgress() {
      if (!this.pkg) return;
      const progress = {
        code: this.pkg.code,
        currentStep: this.currentStep,
        boxQty: this.boxQty,
        selectedDesignId: this.selectedDesign?.id || null,
        selectedCardId: this.selectedCard?.id || null,
        cardMessage: this.cardMessage
      };
      localStorage.setItem('packageOrderProgress', JSON.stringify(progress));
    },

    loadProgress() {
      const saved = localStorage.getItem('packageOrderProgress');
      if (!saved) return;

      try {
        const progress = JSON.parse(saved);
        if (this.pkg && progress.code === this.pkg.code) {
          this.currentStep = progress.currentStep || 1;
          this.boxQty = progress.boxQty || 1;
          this.selectedDesign = this.designs.find(d => d.id === progress.selectedDesignId) || null;
          this.selectedCard = this.cards.find(c => c.id === progress.selectedCardId) || null;
          this.cardMessage = progress.cardMessage || '';
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    },

    // Interactions
    openLightbox(img, title, category = 'Preview Desain Box') {
      this.lightboxImg = img;
      this.lightboxTitle = title;
      this.lightboxCategory = category;
      this.showLightbox = true;
    },

    closeLightbox() {
      this.showLightbox = false;
    },

    increaseBoxQty() {
      if (this.boxQty < 999) this.boxQty++;
    },

    decreaseBoxQty() {
      if (this.boxQty > 1) this.boxQty--;
    },

    selectDesign(design) {
      this.selectedDesign = design;
    },

    selectCard(card) {
      this.selectedCard = card;
      if (card.id === 'card-none') this.cardMessage = '';
    },

    // Computed / Getters
    get foodItems() {
      return this.pkg?.items.filter(item => !item.toLowerCase().includes('air mineral')) || [];
    },

    get drinkItems() {
      return this.pkg?.items.filter(item => item.toLowerCase().includes('air mineral')) || [];
    },

    get priceBreakdown() {
      const designPrice = this.selectedDesign?.price || 0;
      const cardPrice = this.selectedCard?.price || 0;
      const basePrice = this.pkg?.price || 0;
      const perBox = basePrice + designPrice + cardPrice;
      
      return {
        base: basePrice,
        design: designPrice,
        card: cardPrice,
        perBox: perBox,
        total: perBox * this.boxQty
      };
    },

    get relatedPackages() {
      if (!this.pkg) return [];
      return PACKAGE_DATA.filter(p => p.category === this.pkg.category && p.code !== this.pkg.code);
    },

    // Checkout
    checkout() {
      if (!this.pkg) return;

      const breakdown = this.priceBreakdown;
      const order = {
        type: 'package',
        package: { ...this.pkg },
        boxQty: this.boxQty,
        design: {
          name: this.selectedDesign?.name || null,
          price: breakdown.design
        },
        card: {
          name: this.selectedCard?.id !== 'card-none' ? this.selectedCard?.name : null,
          message: this.cardMessage || null,
          price: breakdown.card
        },
        pricePerBox: breakdown.perBox,
        totalPrice: breakdown.total
      };

      localStorage.setItem('order', JSON.stringify(order));
      window.location.href = 'checkout.html';
    }
  };
}
