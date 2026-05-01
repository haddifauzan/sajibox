// assets/js/custom.js

function customPage() {
  return {
    // ── UI State ──────────────────────────────────────────
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    currentStep: 1,
    totalSteps: 4,
    showLightbox: false,
    lightboxImg: '',
    lightboxTitle: '',

    showResetModal: false,
    summaryOpen: false,

    openLightbox(img, title) {
      this.lightboxImg = img;
      this.lightboxTitle = title;
      this.showLightbox = true;
    },
    closeLightbox() {
      this.showLightbox = false;
    },

    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: false },
      { label: 'Custom Pesanan', href: 'custom.html', active: true },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // ── Data ──────────────────────────────────────────────
    boxes: [],
    foods: [],
    designs: [],
    cards: [],

    // ── Order State ───────────────────────────────────────
    selectedBox: null,
    boxQty: 1,
    selectedFoods: {},   // { foodId: qty }
    selectedDesign: null,
    selectedCard: null,
    cardMessage: '',
    activeCat: 'Semua',

    // ── Computed helpers ──────────────────────────────────
    get totalItemCount() {
      return Object.values(this.selectedFoods).reduce((s, q) => s + q, 0);
    },

    get currentCapacity() {
      return this.selectedBox ? this.selectedBox.maxItem : 0;
    },

    get minCapacity() {
      return this.selectedBox ? this.selectedBox.minItem : 0;
    },

    get capacityPercent() {
      if (!this.selectedBox) return 0;
      return Math.round((this.totalItemCount / this.selectedBox.maxItem) * 100);
    },

    get isCapacityValid() {
      if (!this.selectedBox) return false;
      return this.totalItemCount >= this.minCapacity && this.totalItemCount <= this.currentCapacity;
    },

    // Price per single box
    get boxPrice() {
      return this.selectedBox ? this.selectedBox.price : 0;
    },

    get foodsPrice() {
      return Object.entries(this.selectedFoods).reduce((total, [id, qty]) => {
        const food = this.foods.find(f => f.id === id);
        return total + (food ? food.price * qty : 0);
      }, 0);
    },

    get designPrice() {
      return this.selectedDesign ? this.selectedDesign.price : 0;
    },

    get cardPrice() {
      return this.selectedCard ? this.selectedCard.price : 0;
    },

    // Price for ONE box (box base + all food + design + card)
    get pricePerBox() {
      return this.boxPrice + this.foodsPrice + this.designPrice + this.cardPrice;
    },

    // Total = pricePerBox * qty
    get totalPrice() {
      return this.pricePerBox * this.boxQty;
    },

    get selectedFoodsList() {
      return Object.entries(this.selectedFoods)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const food = this.foods.find(f => f.id === id);
          return food ? { ...food, qty } : null;
        })
        .filter(Boolean);
    },

    // ── Step validation ───────────────────────────────────
    canProceedStep(step) {
      if (step === 1) return !!this.selectedBox;
      if (step === 2) return this.isCapacityValid;
      if (step === 3) return !!this.selectedDesign;
      if (step === 4) return true;
      return false;
    },

    // ── Init ─────────────────────────────────────────────
    init() {
      this.boxes = typeof BOX_DATA !== 'undefined' ? BOX_DATA : [];
      this.foods = typeof FOODS_DATA !== 'undefined' ? FOODS_DATA : [];
      this.cards = typeof CARDS_DATA !== 'undefined' ? CARDS_DATA : [];

      this.designs = [
        { id: 'design-1', name: 'Classic Kraft', price: 0, image: 'assets/images/design_box/design-1.png', description: 'Ceria dengan nuansa oranye khas SajiBox' },
        { id: 'design-2', name: 'Playful Pattern', price: 1000, image: 'assets/images/design_box/design-2.png', description: 'Motif fun & ramai untuk kesan santai' },
        { id: 'design-3', name: 'Modern Stripe', price: 1000, image: 'assets/images/design_box/design-3.png', description: 'Elegan dengan warna coklat premium' },
        { id: 'design-4', name: 'Festive Party', price: 1000, image: 'assets/images/design_box/design-4.png', description: 'Kalem dan natural dengan sentuhan hijau' },
        { id: 'design-5', name: 'Premium Gold', price: 1000, image: 'assets/images/design_box/design-5.png', description: 'Cerah & mencolok untuk acara spesial' },
      ];

      this.loadProgress();

      this.$watch('currentStep', () => this.saveProgress());
      this.$watch('selectedBox', () => this.saveProgress());
      this.$watch('boxQty', () => this.saveProgress());
      this.$watch('selectedFoods', () => this.saveProgress());
      this.$watch('selectedDesign', () => this.saveProgress());
      this.$watch('selectedCard', () => this.saveProgress());
      this.$watch('cardMessage', () => this.saveProgress());

      setTimeout(() => { this.isLoading = false; }, 900);
    },

    saveProgress() {
      const progress = {
        currentStep: this.currentStep,
        selectedBoxId: this.selectedBox ? this.selectedBox.id : null,
        boxQty: this.boxQty,
        selectedFoods: this.selectedFoods,
        selectedDesignId: this.selectedDesign ? this.selectedDesign.id : null,
        selectedCardId: this.selectedCard ? this.selectedCard.id : null,
        cardMessage: this.cardMessage
      };
      localStorage.setItem('customOrderProgress', JSON.stringify(progress));
    },

    loadProgress() {
      const saved = localStorage.getItem('customOrderProgress');
      if (saved) {
        try {
          const progress = JSON.parse(saved);
          this.currentStep = progress.currentStep || 1;
          if (progress.selectedBoxId) {
            this.selectedBox = this.boxes.find(b => b.id === progress.selectedBoxId) || null;
          }
          if (progress.boxQty) {
            this.boxQty = progress.boxQty;
          }
          if (progress.selectedFoods) {
            this.selectedFoods = progress.selectedFoods;
          }
          if (progress.selectedDesignId) {
            this.selectedDesign = this.designs.find(d => d.id === progress.selectedDesignId) || null;
          }
          if (progress.selectedCardId) {
            this.selectedCard = this.cards.find(c => c.id === progress.selectedCardId) || null;
          }
          if (progress.cardMessage !== undefined) {
            this.cardMessage = progress.cardMessage;
          }
        } catch (e) {
          console.error("Failed to load custom order progress", e);
        }
      }
    },

    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    // ── Step navigation ───────────────────────────────────
    goToStep(step) {
      if (step > this.currentStep && !this.canProceedStep(this.currentStep)) return;
      if (step < 1 || step > this.totalSteps) return;
      this.currentStep = step;
      this.$nextTick(() => {
        document.getElementById('step-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },

    nextStep() { this.goToStep(this.currentStep + 1); },
    prevStep() { this.goToStep(this.currentStep - 1); },

    // ── Step 1: Box ───────────────────────────────────────
    selectBox(box) {
      this.selectedBox = box;
      this.selectedFoods = {};
    },

    increaseBoxQty() { this.boxQty = Math.min(this.boxQty + 1, 100); },
    decreaseBoxQty() { this.boxQty = Math.max(this.boxQty - 1, 1); },

    // ── Step 2: Foods ─────────────────────────────────────
    getFoodQty(foodId) {
      return this.selectedFoods[foodId] || 0;
    },

    canAddFood(foodId) {
      return this.totalItemCount < this.currentCapacity;
    },

    addFood(food) {
      if (!this.canAddFood(food.id)) return;
      this.selectedFoods = {
        ...this.selectedFoods,
        [food.id]: (this.selectedFoods[food.id] || 0) + 1
      };
    },

    removeFood(food) {
      const current = this.selectedFoods[food.id] || 0;
      if (current <= 0) return;
      const updated = { ...this.selectedFoods };
      if (current === 1) {
        delete updated[food.id];
      } else {
        updated[food.id] = current - 1;
      }
      this.selectedFoods = updated;
    },

    // ── Step 3: Design ────────────────────────────────────
    selectDesign(design) {
      this.selectedDesign = design;
    },

    // ── Step 4: Card ──────────────────────────────────────
    selectCard(card) {
      this.selectedCard = card;
      if (card.id === 'card-none') this.cardMessage = '';
    },

    get cardMessageCount() {
      return this.cardMessage.length;
    },

    // ── Checkout ──────────────────────────────────────────
    checkout() {
      const order = {
        type: 'custom',
        box: {
          name: this.selectedBox.name,
          price: this.selectedBox.price
        },
        boxQty: this.boxQty,
        foods: this.selectedFoodsList.map(f => ({
          name: f.name,
          qty: f.qty,
          price: f.price
        })),
        design: {
          name: this.selectedDesign.name,
          price: this.selectedDesign.price
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
      // localStorage.removeItem('customOrderProgress'); // Don't remove yet so we can edit
      window.location.href = 'checkout.html';
    },

    confirmReset() {
      this.selectedBox = null;
      this.boxQty = 1;
      this.selectedFoods = {};
      this.selectedDesign = null;
      this.selectedCard = null;
      this.cardMessage = '';
      this.currentStep = 1;
      
      localStorage.removeItem('customOrderProgress');
      this.showResetModal = false;
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ── Helpers ───────────────────────────────────────────
    formatPrice(n) {
      return 'Rp ' + n.toLocaleString('id-ID');
    },

    getFoodsByCategory(category) {
      if (category === 'Semua') return this.foods;
      return this.foods.filter(f => f.category === category);
    },

    get foodCategories() {
      const cats = [...new Set(this.foods.map(f => f.category))];
      return ['Semua', ...cats];
    },

    stepTitle(step) {
      return ['Ukuran Box', 'Isi Makanan', 'Desain Box', 'Kartu Ucapan'][step - 1] || '';
    }
  };
}