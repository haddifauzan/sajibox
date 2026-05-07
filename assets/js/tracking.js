// assets/js/tracking.js

function trackingPage() {
  return {
    // ── UI State ──
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    
    // ── Tracking State ──
    searchQuery: '',
    isSearching: false,
    hasSearched: false,
    notFound: false,
    orderData: null,

    // ── Navigation ──
    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: false },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: true },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // ── Lifecycle ──
    init() {
      // Check for saved order data for instant display
      const savedData = localStorage.getItem('sajibox_last_order_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          this.orderData = parsed;
          this.hasSearched = true;
          this.searchQuery = parsed.orderId;
          
          // Silently refresh data in background
          this.fetchTracking(true);
        } catch (e) {
          localStorage.removeItem('sajibox_last_order_data');
        }
      }

      // Simulate initial page load
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    },

    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    // ── Actions ──
    async fetchTracking(isSilent = false) {
      const query = this.searchQuery.trim().toUpperCase();
      if (!query) return;

      if (!isSilent) {
        this.isSearching = true;
        this.hasSearched = true;
        this.notFound = false;
        // Don't clear orderData if it's silent to avoid flickers
        this.orderData = null;
      }

      try {
        let scriptURL = "";
        let isPackage = false;

        if (query.startsWith('SBXC-')) {
          scriptURL = "https://script.google.com/macros/s/AKfycbwyb1JpPdgbt1XzA4KaL0NZ4CpLXJOKvIJP_4nfmuCdn-lE_UlEV_ZvtdU5eoPrZRw/exec";
        } else if (query.startsWith('SBXP-')) {
          scriptURL = "https://script.google.com/macros/s/AKfycbyFYQchOW-TKPgXD-UxLCG2XXXQ3syZOonT1Dj7xEo6RBZBjUHu1XFtWS9ZGItwkhtSLQ/exec";
          isPackage = true;
        } else {
          this.notFound = true;
          this.isSearching = false;
          return;
        }

        const response = await fetch(`${scriptURL}?orderId=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.status === 'success' && data.order) {
          const o = data.order;
          let normalizedData = null;
          
          if (isPackage) {
            normalizedData = {
              orderId: o.orderId,
              orderDate: o.date,
              customer: {
                name: o.customer,
                phone: o.phone,
                address: o.address,
                note: o.note
              },
              delivery: {
                date: o.deliveryDate,
                time: o.deliveryTime
              },
              type: 'package',
              packageName: o.packageName,
              qty: o.qty,
              foods: [],
              design: o.design,
              card: {
                name: o.card,
                message: o.cardMessage
              },
              total: o.total,
              trackingStatus: o.trackingStatus || 'Dipesan'
            };
          } else {
            if (typeof o.foods === 'string') {
              o.foods = o.foods.split(',').map(f => f.trim()).filter(f => f);
            } else if (!o.foods) {
              o.foods = [];
            }
            if (!o.trackingStatus || o.trackingStatus === 'Pending') {
              o.trackingStatus = 'Dipesan';
            }
            normalizedData = o;
          }

          this.orderData = normalizedData;
          // Save the full normalized data for instant next load
          localStorage.setItem('sajibox_last_order_data', JSON.stringify(normalizedData));
        } else {
          this.notFound = true;
          if (isSilent) this.hasSearched = false;
        }
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        if (!isSilent) this.notFound = true;
      } finally {
        this.isSearching = false;
      }
    },

    resetSearch() {
      this.searchQuery = '';
      this.hasSearched = false;
      this.notFound = false;
      this.orderData = null;
      localStorage.removeItem('sajibox_last_order_data');
    },

    // ── Helpers ──
    formatPrice(amount) {
      if (typeof amount !== 'number') amount = parseInt(amount);
      if (isNaN(amount)) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },

    getStatusColor(status) {
      const s = (status || '').toLowerCase();
      if (s === 'dipesan' || s === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      if (s === 'diproses') return 'bg-blue-100 text-blue-700 border-blue-200';
      if (s === 'dikirim') return 'bg-orange-100 text-orange-700 border-orange-200';
      if (s === 'selesai') return 'bg-green-100 text-green-700 border-green-200';
      if (s === 'dibatalkan') return 'bg-red-100 text-red-700 border-red-200';
      return 'bg-gray-100 text-gray-700 border-gray-200';
    },

    getTimelineIndex(status) {
      const s = (status || '').toLowerCase();
      if (s === 'dibatalkan') return -1;
      if (s === 'dipesan' || s === 'pending') return 0;
      if (s === 'diproses') return 1;
      if (s === 'dikirim') return 2;
      if (s === 'selesai') return 3;
      return 0;
    }
  };
}
