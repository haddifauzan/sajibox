// assets/js/checkout.js

function checkoutPage() {
  let mapObj = null;
  let markerObj = null;

  return {
    isLoading: true,
    order: null,

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

    init() {
      // Get order from localStorage
      const savedOrder = localStorage.getItem('order');
      if (savedOrder) {
        try {
          this.order = JSON.parse(savedOrder);
        } catch (e) {
          console.error("Gagal memuat data pesanan:", e);
        }
      }

      // Load saved customer info if any
      const savedInfo = localStorage.getItem('customerInfo');
      if (savedInfo) {
        try {
          const info = JSON.parse(savedInfo);
          this.customerName = info.name || '';
          this.customerPhone = info.phone || '';
          this.customerAddress = info.address || '';
          this.customerNote = info.note || '';
          this.deliveryDate = info.deliveryDate || '';
          this.deliveryTime = info.deliveryTime || '';
          this.addressLat = info.lat || null;
          this.addressLng = info.lng || null;
        } catch (e) {}
      }

      // Generate Order ID if not exists
      const prefix = (this.order && this.order.type === 'package') ? 'SBXP' : 'SBXC';
      this.orderId = prefix + '-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');

      this.validateDeliveryTime();

      setTimeout(() => { 
        this.isLoading = false; 
        this.$nextTick(() => {
          this.initMap();
        });
      }, 500);
    },

    initMap() {
      if (typeof L === 'undefined') return;
      const mapEl = document.getElementById('address-map');
      if (!mapEl) return;
      if (mapObj) return; // Already initialized

      try {
        // Default to Cimahi center
        const defaultLat = -6.8732;
        const defaultLng = 107.5401;
        
        const startLat = this.addressLat || defaultLat;
        const startLng = this.addressLng || defaultLng;

        mapObj = L.map('address-map').setView([startLat, startLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapObj);

        if (this.addressLat && this.addressLng) {
          markerObj = L.marker([this.addressLat, this.addressLng]).addTo(mapObj);
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
          
          this.saveCustomerInfo();
        });
      } catch (e) {
        console.error("Map init error:", e);
      }
    },

    clearMap() {
      this.addressLat = null;
      this.addressLng = null;
      if (markerObj && mapObj) {
        mapObj.removeLayer(markerObj);
        markerObj = null;
      }
      this.saveCustomerInfo();
    },

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

    validateDeliveryTime() {
      // If date is today and selected time is already past, reset time
      const today = new Date().toISOString().split('T')[0];
      if (this.deliveryDate === today) {
        const currentHour = new Date().getHours();
        if (this.deliveryTime && parseInt(this.deliveryTime) <= currentHour) {
          this.deliveryTime = '';
        }
      }
      // If date is before today, reset date
      if (this.deliveryDate && this.deliveryDate < this.minDate) {
        this.deliveryDate = '';
        this.deliveryTime = '';
      }
      this.saveCustomerInfo();
    },

    triggerModal(title, message, type = 'info') {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = type;
      this.showStatusModal = true;
    },

    get isFormValid() {
      const name = (this.customerName || '').trim();
      const phone = (this.customerPhone || '').trim();
      const addr = (this.customerAddress || '').trim();
      return !!(name && phone && addr && this.deliveryDate && this.deliveryTime);
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
        lng: this.addressLng
      };
      localStorage.setItem('customerInfo', JSON.stringify(info));
    },

    formatPrice(n) {
      if (!n) return 'Rp 0';
      return 'Rp ' + n.toLocaleString('id-ID');
    },

    backToShop() {
      // Determine where to go back based on order type
      if (this.order && this.order.type === 'package') {
        window.location.href = 'package_detail.html?code=' + encodeURIComponent(this.order.package.code);
      } else {
        window.location.href = 'custom.html';
      }
    },

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

    processCheckout() {
      this.showConfirmModal = false;
      this.isLoading = true;
      this.saveCustomerInfo();

      let finalAddress = this.customerAddress;
      if (this.addressLat && this.addressLng) {
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
        totalPrice: this.order.totalPrice || 0
      };

      let scriptURL = "https://script.google.com/macros/s/AKfycbwyb1JpPdgbt1XzA4KaL0NZ4CpLXJOKvIJP_4nfmuCdn-lE_UlEV_ZvtdU5eoPrZRw/exec";

      if (this.order && this.order.type === 'package') {
        scriptURL = "https://script.google.com/macros/s/AKfycbyFYQchOW-TKPgXD-UxLCG2XXXQ3syZOonT1Dj7xEo6RBZBjUHu1XFtWS9ZGItwkhtSLQ/exec";
        payload.packageQty = this.order.boxQty;
      }

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload),
        mode: "no-cors"
      })
      .then(() => {
        this.triggerModal(
          "Pesanan Terkirim!",
          "Terima kasih " + this.customerName + ", pesanan Anda sudah kami terima.",
          "success"
        );

        // cleanup
        localStorage.removeItem("order");
        localStorage.removeItem("customOrderProgress");
        localStorage.removeItem("packageOrderProgress");
      })
      .catch(err => {
        console.error("Submit Error:", err);
        this.triggerModal(
          "Gagal Mengirim",
          "Koneksi bermasalah. Coba lagi.",
          "error"
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
    },

    handleModalClose() {
      this.showStatusModal = false;
      if (this.modalType === 'success') {
        this.sendToWhatsApp();
        this.order = null; // Clear data after sending to WA
      }
    },

    sendToWhatsApp() {
      const waNumber = "6281313264584";
      
      let message = `*HALO SAJIBOX! SAYA INGIN PESAN*%0A%0A`;
      let finalAddress = this.customerAddress;
      if (this.addressLat && this.addressLng) {
        finalAddress += ` (Lat: ${this.addressLat.toFixed(5)}, Lng: ${this.addressLng.toFixed(5)})`;
      }

      message += `*Nomor Pesanan:* ${this.orderId}%0A`;
      message += `*Nama:* ${this.customerName}%0A`;
      message += `*No. HP:* ${this.customerPhone}%0A`;
      message += `*Alamat:* ${finalAddress}%0A`;
      message += `*Waktu Kirim:* ${this.deliveryDate}, jam ${this.deliveryTime}%0A%0A`;
      
      message += `*DETAIL PESANAN:*%0A`;
      message += `- Tipe: ${this.order.type === 'custom' ? 'Custom Snackbox' : 'Paketan'}%0A`;
      
      if (this.order.type === 'custom') {
        message += `- Box: ${this.order.box.name}%0A`;
        message += `- Design: ${this.order.design.name}%0A`;
        if (this.order.card.name) {
          message += `- Card: ${this.order.card.name}%0A`;
          if (this.order.card.message) message += `  "${this.order.card.message}"%0A`;
        }
        
        message += `%0A*DAFTAR MAKANAN:*%0A`;
        (this.order.foods || []).forEach(f => {
          message += `- ${f.name} (x${f.qty})%0A`;
        });
      } else {
        // Package order
        message += `- Paket: ${this.order.package.name}%0A`;
        message += `- Box: ${this.order.package.box}%0A`;
        message += `- Design: ${this.order.design.name}%0A`;
        if (this.order.card.name) {
          message += `- Card: ${this.order.card.name}%0A`;
          if (this.order.card.message) message += `  "${this.order.card.message}"%0A`;
        }

        message += `%0A*DAFTAR MAKANAN:*%0A`;
        (this.order.package.items || []).forEach(item => {
          message += `- ${item}%0A`;
        });
      }

      message += `%0A*JUMLAH:* ${this.order.boxQty} Box%0A`;
      message += `*TOTAL ESTIMASI:* ${this.formatPrice(this.order.totalPrice)}%0A`;
      
      if (this.customerNote) {
        message += `%0A*Catatan:* ${this.customerNote}%0A`;
      }

      const waURL = `https://wa.me/${waNumber}?text=${message}`;
      window.location.href = waURL;
    }
  };
}
