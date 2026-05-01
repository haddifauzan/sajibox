// assets/js/checkout.js

function checkoutPage() {
  return {
    isLoading: true,
    order: null,

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

      setTimeout(() => { this.isLoading = false; }, 500);
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

    processCheckout() {
      // Here you would integrate with a real checkout system or WhatsApp API
      alert("Memproses pesanan... Terima kasih telah memesan di SajiBox!");
      // Optional: Clear order after success
      // localStorage.removeItem('order');
      // window.location.href = 'index.html';
    }
  };
}
