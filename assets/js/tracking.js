/**
 * SajiBox - Tracking Page Logic (Alpine.js)
 */

const TRACKING_CONSTANTS = {
  // Navigation
  pageNav: [
    { label: 'Beranda', href: 'index.html', active: false },
    { label: 'List Paket', href: 'package.html', active: false },
    { label: 'Custom Pesanan', href: 'custom.html', active: false },
    { label: 'Tracking', href: 'tracking.html', active: true },
    { label: 'Tentang', href: 'about.html', active: false },
  ],

  // Google Script URLs for Tracking
  endpoints: {
    custom: "https://script.google.com/macros/s/AKfycbzSz_DinGTyRfmhy9cVx6qHX0adSUHMxCHDXNqIk45N_MFrTqxncqVDGfmSGYp4nIGGXg/exec",
    package: "https://script.google.com/macros/s/AKfycbz9XxmgUiWAHSN7-JvnZNuvQ1Li-0rK70qntVGcVpwA_ScqfNQ4pGWoYvZNbor9YB7tTA/exec"
  },

  // Status Styling Map
  statusConfigs: {
    'dipesan': { class: 'bg-yellow-100 text-yellow-700 border-yellow-200', index: 0 },
    'diproses': { class: 'bg-blue-100 text-blue-700 border-blue-200', index: 1 },
    'dikirim': { class: 'bg-orange-100 text-orange-700 border-orange-200', index: 2 },
    'siap diambil': { class: 'bg-orange-100 text-orange-700 border-orange-200', index: 2 },
    'selesai': { class: 'bg-green-100 text-green-700 border-green-200', index: 3 },
    'dibatalkan': { class: 'bg-red-100 text-red-700 border-red-200', index: -1 },
    'default': { class: 'bg-gray-100 text-gray-700 border-gray-200', index: 0 }
  }
};

// ── COMPONENT: TRACKING PAGE ──

function trackingPage() {
  return {
    ...TRACKING_CONSTANTS,
    // UI State
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    
    // Tracking State
    searchQuery: '',
    isSearching: false,
    hasSearched: false,
    notFound: false,
    orderData: null,

    // Lifecycle
    init() {
      // Load saved order data for instant feedback
      const saved = localStorage.getItem('sajibox_last_order_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.orderData = parsed;
          this.hasSearched = true;
          this.searchQuery = parsed.orderId;
          
          // Silently refresh in background
          this.fetchTracking(true);
        } catch (e) {
          localStorage.removeItem('sajibox_last_order_data');
        }
      }

      setTimeout(() => { this.isLoading = false; }, 800);
    },

    // UI Helpers
    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    formatPrice(n) {
      return 'Rp ' + Number(n).toLocaleString('id-ID');
    },

    getStatusConfig(status) {
      const s = (status || '').toLowerCase();
      return this.statusConfigs[s] || this.statusConfigs.default;
    },

    getTimelineIndex(status) {
      return this.getStatusConfig(status).index;
    },

    getStatusColor(status) {
      return this.getStatusConfig(status).class;
    },

    // Actions
    resetSearch() {
      this.searchQuery = '';
      this.hasSearched = false;
      this.notFound = false;
      this.orderData = null;
      localStorage.removeItem('sajibox_last_order_data');
    },

    async fetchTracking(isSilent = false) {
      const query = this.searchQuery.trim().toUpperCase();
      if (!query) return;

      if (!isSilent) {
        this.isSearching = true;
        this.hasSearched = true;
        this.notFound = false;
        this.orderData = null;
      }

      try {
        const isPackage = query.startsWith('SBXP-');
        const scriptURL = isPackage ? this.endpoints.package : (query.startsWith('SBXC-') ? this.endpoints.custom : null);

        if (!scriptURL) {
          this.notFound = true;
          this.isSearching = false;
          return;
        }

        const response = await fetch(`${scriptURL}?orderId=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data?.status === 'success' && data.order) {
          const normalized = this.normalizeOrderData(data.order, isPackage);
          this.orderData = normalized;
          localStorage.setItem('sajibox_last_order_data', JSON.stringify(normalized));
        } else {
          this.notFound = true;
          if (isSilent) this.hasSearched = false;
        }
      } catch (error) {
        console.error("Tracking Error:", error);
        if (!isSilent) this.notFound = true;
      } finally {
        this.isSearching = false;
      }
    },

    normalizeOrderData(o, isPackage) {
      let parsedFoods = [];
      if (!isPackage && o.foods) {
        if (typeof o.foods === 'string') {
          parsedFoods = o.foods.split(',').map(f => f.trim()).filter(f => f);
        } else if (Array.isArray(o.foods)) {
          parsedFoods = o.foods;
        }
      }

      return {
        orderId: o.orderId,
        orderDate: o.orderDate || o.date,
        customer: o.customer || {},
        delivery: {
          date: o.delivery?.date || '',
          time: o.delivery?.time || '',
          method: o.deliveryMethod || 'pickup',
          distance: o.distance || 0,
          cost: o.shippingCost || 0
        },
        type: isPackage ? 'package' : 'custom',
        packageName: isPackage ? o.packageName : (o.boxName || 'Custom Snackbox'),
        qty: o.qty || 0,
        foods: parsedFoods,
        design: o.design || '-',
        card: o.card || { name: '-', message: '-' },
        total: o.total || 0,
        trackingStatus: (!o.trackingStatus || o.trackingStatus === 'Pending') ? 'Dipesan' : o.trackingStatus
      };
    }
  };
}