// assets/js/checkout.js

function checkoutPage() {
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
        } catch (e) {}
      }

      // Generate Order ID if not exists
      this.orderId = 'SBX-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');

      this.validateDeliveryTime();

      setTimeout(() => { this.isLoading = false; }, 500);
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

    saveCustomerInfo() {
      const info = {
        name: this.customerName,
        phone: this.customerPhone,
        address: this.customerAddress,
        note: this.customerNote,
        deliveryDate: this.deliveryDate,
        deliveryTime: this.deliveryTime
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
        window.location.href = 'package.html';
      } else {
        window.location.href = 'custom.html';
      }
    },

    confirmOrder() {
      if (!this.order) {
        this.triggerModal("Pesanan Kosong", "Anda belum memiliki pesanan untuk dicheckout.", "error");
        return;
      }
      if (!this.customerName || !this.customerPhone || !this.customerAddress || !this.deliveryDate || !this.deliveryTime) {
        this.triggerModal("Data Belum Lengkap", "Mohon lengkapi Nama, Nomor HP, Alamat, serta Waktu Pengiriman.", "info");
        return;
      }
      this.showConfirmModal = true;
    },

    processCheckout() {
      this.showConfirmModal = false;
      this.isLoading = true;
      this.saveCustomerInfo();

      const payload = {
        orderId: this.orderId,
        ...this.order,
        customer: {
          name: this.customerName,
          phone: this.customerPhone,
          address: this.customerAddress,
          note: this.customerNote,
          deliveryDate: this.deliveryDate,
          deliveryTime: this.deliveryTime
        },
        totalPrice: this.order.totalPrice || 0
      };

      const scriptURL = "https://script.google.com/macros/s/AKfycbyMNbyuuN5Ux1yjdGpg8TGrJI9j8I6QbhpzOdCV91z7yP8gM3dN8BX8H9j-yFKlG9ve/exec";

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
      }
    },

    sendToWhatsApp() {
      const waNumber = "6281313264584";
      
      let message = `*HALO SAJIBOX! SAYA INGIN PESAN*%0A%0A`;
      message += `*Nomor Pesanan:* ${this.orderId}%0A`;
      message += `*Nama:* ${this.customerName}%0A`;
      message += `*No. HP:* ${this.customerPhone}%0A`;
      message += `*Alamat:* ${this.customerAddress}%0A`;
      message += `*Waktu Kirim:* ${this.deliveryDate}, jam ${this.deliveryTime}%0A%0A`;
      
      message += `*DETAIL PESANAN:*%0A`;
      message += `- Tipe: ${this.order.type === 'custom' ? 'Custom Snackbox' : 'Paket Jadi'}%0A`;
      
      if (this.order.type === 'custom') {
        message += `- Box: ${this.order.box.name}%0A`;
        message += `- Design: ${this.order.design.name}%0A`;
        if (this.order.card.name) {
          message += `- Card: ${this.order.card.name}%0A`;
          if (this.order.card.message) message += `  "${this.order.card.message}"%0A`;
        }
      }

      message += `%0A*DAFTAR MAKANAN:*%0A`;
      this.order.foods.forEach(f => {
        message += `- ${f.name} (x${f.qty})%0A`;
      });

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
