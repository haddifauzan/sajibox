/**
 * SajiBox - Checkout Page Logic (Alpine.js)
 */

// ── CONSTANTS ──

const CHECKOUT_CONSTANTS = {
  // Map Config
  map: {
    defaultPos: [-6.8732, 107.5401], // Cimahi Center
    defaultZoom: 14,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },

  // Google Script URLs
  endpoints: {
    custom: "https://script.google.com/macros/s/AKfycbzSz_DinGTyRfmhy9cVx6qHX0adSUHMxCHDXNqIk45N_MFrTqxncqVDGfmSGYp4nIGGXg/exec",
    package: "https://script.google.com/macros/s/AKfycbz9XxmgUiWAHSN7-JvnZNuvQ1Li-0rK70qntVGcVpwA_ScqfNQ4pGWoYvZNbor9YB7tTA/exec"
  },

  // WhatsApp Config
  waNumber: "6281313264584",

  // Store Location
  storeLocation: {
    lat: -6.890002,
    lng: 107.550129
  }
};

// ── COMPONENT: CHECKOUT PAGE ──

function checkoutPage() {
  let mapObj = null;
  let markerObj = null;

  return {
    ...CHECKOUT_CONSTANTS,
    // UI State
    isLoading: true,
    scrolled: false,
    mobileOpen: false,
    order: null,

    pageNav: [
      { label: 'Beranda', href: 'index.html', active: false },
      { label: 'List Paket', href: 'package.html', active: false },
      { label: 'Custom Pesanan', href: 'custom.html', active: false },
      { label: 'Tracking', href: 'tracking.html', active: false },
      { label: 'Tentang', href: 'about.html', active: false },
    ],

    // Customer Info
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerNote: '',
    deliveryDate: '',
    deliveryTime: '',
    addressLat: null,
    addressLng: null,

    // Modal State
    showConfirmModal: false,
    showStatusModal: false,
    modalTitle: '',
    modalMessage: '',
    modalType: 'info', // info, success, error
    orderId: '',

    // Actions
    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    // Shipping & Delivery State
    deliveryMethod: 'pickup', // 'pickup' | 'delivery'
    shippingCost: 0,
    finalShippingCost: 0,
    isFreeShipping: false,
    customerDistance: 0,
    shippingAvailable: true,

    // Lifecycle
    init() {
      // Load order data
      const savedOrder = localStorage.getItem('order');
      if (savedOrder) {
        try {
          this.order = JSON.parse(savedOrder);
        } catch (e) {
          console.error("Load Order Error:", e);
        }
      }

      // Load saved customer info
      const savedInfo = localStorage.getItem('customerInfo');
      if (savedInfo) {
        try {
          const info = JSON.parse(savedInfo);
          Object.assign(this, {
            customerName: info.name || '',
            customerPhone: info.phone || '',
            customerAddress: info.address || '',
            customerNote: info.note || '',
            deliveryDate: info.deliveryDate || '',
            deliveryTime: info.deliveryTime || '',
            addressLat: info.lat || null,
            addressLng: info.lng || null,
            deliveryMethod: info.deliveryMethod || 'pickup'
          });
        } catch (e) {}
      }

      // Generate Order ID
      const prefix = this.order?.type === 'package' ? 'SBXP' : 'SBXC';
      this.orderId = `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

      this.validateDeliveryTime();
      this.calculateShipping();

      this.$watch('deliveryMethod', (value) => {
        this.calculateShipping();
        if (value === 'delivery') {
          this.$nextTick(() => {
            this.initMap();
            if (mapObj) mapObj.invalidateSize();
          });
        }
      });

      setTimeout(() => { 
        this.isLoading = false; 
        if (this.deliveryMethod === 'delivery') {
          this.$nextTick(() => this.initMap());
        }
      }, 500);
    },

    // Map Management
    initMap() {
      if (typeof L === 'undefined') return;
      const mapEl = document.getElementById('address-map');
      if (!mapEl || mapObj) return;

      try {
        const startPos = (this.addressLat && this.addressLng) 
          ? [this.addressLat, this.addressLng] 
          : this.map.defaultPos;

        mapObj = L.map('address-map').setView(startPos, this.map.defaultZoom);

        L.tileLayer(this.map.tileLayer, { attribution: this.map.attribution }).addTo(mapObj);

        if (this.addressLat && this.addressLng) {
          markerObj = L.marker(startPos).addTo(mapObj);
        }

        mapObj.on('click', (e) => {
          const { lat, lng } = e.latlng;
          this.addressLat = lat;
          this.addressLng = lng;

          if (markerObj) {
            markerObj.setLatLng([lat, lng]);
          } else {
            markerObj = L.marker([lat, lng]).addTo(mapObj);
          }
          this.calculateShipping();
          
          if (!this.shippingAvailable) {
            this.triggerModal("Di Luar Jangkauan", "Mohon maaf, lokasi pengiriman melebihi batas maksimal 15 km.", "error");
          }
          
          this.saveCustomerInfo();
        });
      } catch (e) {
        console.error("Map Init Error:", e);
      }
    },

    clearMap() {
      this.addressLat = null;
      this.addressLng = null;
      if (markerObj && mapObj) {
        mapObj.removeLayer(markerObj);
        markerObj = null;
      }
      this.calculateShipping();
      this.saveCustomerInfo();
    },

    // Shipping Math
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      return parseFloat(d.toFixed(1));
    },

    calculateShipping() {
      if (this.deliveryMethod === 'pickup') {
        this.shippingCost = 0;
        this.finalShippingCost = 0;
        this.shippingAvailable = true;
      } else {
        if (!this.addressLat || !this.addressLng) {
            this.shippingCost = 0;
            this.finalShippingCost = 0;
            this.shippingAvailable = false;
        } else {
            this.customerDistance = this.calculateDistance(this.storeLocation.lat, this.storeLocation.lng, this.addressLat, this.addressLng);
            
            // Shipping Rules
            if (this.customerDistance <= 3) {
                this.shippingCost = 10000;
            } else if (this.customerDistance <= 7) {
                this.shippingCost = 20000;
            } else if (this.customerDistance <= 10) {
                this.shippingCost = 30000;
            } else if (this.customerDistance <= 15) {
                this.shippingCost = 50000;
            } else {
                this.shippingCost = 0;
                this.shippingAvailable = false;
            }

            if (this.customerDistance <= 15) {
                this.shippingAvailable = true;
            }

            this.finalShippingCost = this.shippingCost;
        }
      }

      // Free shipping logic
      if (this.order && this.order.boxQty >= 50 && this.shippingAvailable) {
        this.isFreeShipping = true;
        this.finalShippingCost = 0;
      } else {
        this.isFreeShipping = false;
      }
    },

    // Computed Helpers
    get minDate() {
      return new Date().toISOString().split('T')[0];
    },

    get availableHours() {
      const hours = [];
      for (let i = 8; i <= 20; i++) {
        hours.push(i.toString().padStart(2, '0') + ':00');
      }

      const today = new Date().toISOString().split('T')[0];
      if (this.deliveryDate === today) {
        const currentHour = new Date().getHours();
        return hours.filter(h => parseInt(h) > currentHour);
      }
      return hours;
    },

    get isFormValid() {
      const name = (this.customerName || '').trim();
      const phone = (this.customerPhone || '').trim();
      const addr = (this.customerAddress || '').trim();
      
      const isNamePhoneTimeValid = !!(name && phone && this.deliveryDate && this.deliveryTime);
      
      if (this.deliveryMethod === 'delivery') {
          return isNamePhoneTimeValid && !!addr && !!(this.addressLat && this.addressLng) && this.shippingAvailable;
      }
      return isNamePhoneTimeValid;
    },

    get grandTotal() {
        return (this.order?.totalPrice || 0) + this.finalShippingCost;
    },

    // Form Handlers
    validateDeliveryTime() {
      const today = new Date().toISOString().split('T')[0];
      if (this.deliveryDate === today) {
        const currentHour = new Date().getHours();
        if (this.deliveryTime && parseInt(this.deliveryTime) <= currentHour) {
          this.deliveryTime = '';
        }
      }
      if (this.deliveryDate && this.deliveryDate < this.minDate) {
        this.deliveryDate = '';
        this.deliveryTime = '';
      }
      this.saveCustomerInfo();
    },

    saveCustomerInfo() {
      const info = {
        name: this.customerName,
        phone: this.customerPhone,
        address: this.customerAddress,
        note: this.customerNote,
        deliveryDate: this.deliveryDate,
        deliveryTime: this.deliveryTime,
        lat: this.addressLat,
        lng: this.addressLng,
        deliveryMethod: this.deliveryMethod
      };
      localStorage.setItem('customerInfo', JSON.stringify(info));
    },

    formatPrice(n) {
      return 'Rp ' + (n || 0).toLocaleString('id-ID');
    },

    // Navigation & Modals
    backToShop() {
      if (this.order?.type === 'package') {
        window.location.href = `package_detail.html?code=${encodeURIComponent(this.order.package.code)}`;
      } else {
        window.location.href = 'custom.html';
      }
    },

    triggerModal(title, message, type = 'info') {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = type;
      this.showStatusModal = true;
    },

    handleModalClose() {
      this.showStatusModal = false;
      if (this.modalType === 'success') {
        this.sendToWhatsApp();
        this.order = null;
      }
    },

    // Order Actions
    confirmOrder() {
      if (!this.order) {
        this.triggerModal("Pesanan Kosong", "Anda belum memiliki pesanan untuk dicheckout.", "error");
        return;
      }
      if (!this.isFormValid) {
        this.triggerModal("Data Belum Lengkap", "Mohon lengkapi data pemesan dan pastikan Jam Pengiriman sudah dipilih.", "info");
        return;
      }
      this.showConfirmModal = true;
    },

    async processCheckout() {
      this.showConfirmModal = false;
      this.isLoading = true;
      this.saveCustomerInfo();

      let finalAddress = this.deliveryMethod === 'pickup' ? 'Ambil di Toko' : this.customerAddress;
      if (this.deliveryMethod === 'delivery' && this.addressLat && this.addressLng) {
        finalAddress += ` (Lat: ${this.addressLat.toFixed(5)}, Lng: ${this.addressLng.toFixed(5)})`;
      }

      const payload = {
        orderId: this.orderId,
        ...this.order,
        customer: {
          name: this.customerName,
          phone: this.customerPhone,
          address: finalAddress,
          note: this.customerNote,
          deliveryDate: this.deliveryDate,
          deliveryTime: this.deliveryTime
        },
        deliveryMethod: this.deliveryMethod,
        shippingCost: this.finalShippingCost,
        distance: this.customerDistance,
        totalPrice: this.grandTotal
      };

      const isPackage = this.order?.type === 'package';
      const scriptURL = isPackage ? this.endpoints.package : this.endpoints.custom;
      if (isPackage) payload.packageQty = this.order.boxQty;

      try {
        await fetch(scriptURL, {
          method: "POST",
          body: JSON.stringify(payload),
          mode: "no-cors"
        });

        this.triggerModal(
          "Pesanan Terkirim!",
          `Terima kasih ${this.customerName}, pesanan Anda sudah kami terima.`,
          "success"
        );

        // Cleanup
        ['order', 'customOrderProgress', 'packageOrderProgress'].forEach(k => localStorage.removeItem(k));
      } catch (err) {
        console.error("Submit Error:", err);
        this.triggerModal("Gagal Mengirim", "Koneksi bermasalah. Coba lagi.", "error");
      } finally {
        this.isLoading = false;
      }
    },

    // Communication
    sendToWhatsApp() {
      let finalAddress = this.deliveryMethod === 'pickup' ? 'Ambil di Toko' : this.customerAddress;
      if (this.deliveryMethod === 'delivery' && this.addressLat && this.addressLng) {
        finalAddress += ` (Lat: ${this.addressLat.toFixed(5)}, Lng: ${this.addressLng.toFixed(5)})`;
      }

      let message = `*HALO SAJIBOX! SAYA INGIN PESAN*%0A%0A`;
      message += `*Nomor Pesanan:* ${this.orderId}%0A`;
      message += `*Nama:* ${this.customerName}%0A`;
      message += `*No. HP:* ${this.customerPhone}%0A`;
      message += `*Alamat:* ${finalAddress}%0A`;
      message += `*Waktu Kirim:* ${this.deliveryDate}, jam ${this.deliveryTime}%0A%0A`;
      
      message += `*Metode:* ${this.deliveryMethod === 'pickup' ? 'Pickup (Ambil Sendiri)' : 'Delivery (Pengiriman)'}%0A`;
      if (this.deliveryMethod === 'delivery') {
        message += `*Jarak:* ${this.customerDistance} km%0A`;
        if (this.isFreeShipping) {
          message += `*Ongkir:* GRATIS%0A`;
        } else {
          message += `*Ongkir:* ${this.formatPrice(this.shippingCost)}%0A`;
        }
      }
      message += `%0A`;
      
      message += `*DETAIL PESANAN:*%0A`;
      const isCustom = this.order.type === 'custom';
      message += `- Tipe: ${isCustom ? 'Custom Snackbox' : 'Paketan'}%0A`;
      
      if (isCustom) {
        message += `- Box: ${this.order.box.name}%0A`;
        message += `- Design: ${this.order.design.name}%0A`;
      } else {
        message += `- Paket: ${this.order.package.name}%0A`;
        message += `- Box: ${this.order.package.box}%0A`;
        message += `- Design: ${this.order.design.name}%0A`;
      }

      if (this.order.card?.name) {
        message += `- Card: ${this.order.card.name}%0A`;
        if (this.order.card.message) message += `  "${this.order.card.message}"%0A`;
      }
      
      message += `%0A*DAFTAR MAKANAN:*%0A`;
      const items = isCustom ? (this.order.foods || []) : (this.order.package.items || []);
      items.forEach(it => {
        message += `- ${isCustom ? it.name : it}${isCustom ? ` (x${it.qty})` : ''}%0A`;
      });

      message += `%0A*JUMLAH:* ${this.order.boxQty} Box%0A`;
      message += `*TOTAL PEMBAYARAN:* ${this.formatPrice(this.grandTotal)}%0A`;
      
      if (this.customerNote) {
        message += `%0A*Catatan:* ${this.customerNote}%0A`;
      }

      window.location.href = `https://wa.me/${this.waNumber}?text=${message}`;
    }
  };
}

