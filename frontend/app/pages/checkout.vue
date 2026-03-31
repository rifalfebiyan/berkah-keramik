<template>
  <div class="bg-blue-900/5 min-h-screen py-24 flex items-center justify-center">
    <div class="container">
      <div class="max-w-xl mx-auto">
        <div class="bg-white rounded-[3.5rem] shadow-2xl p-12 text-center border border-gray-50 border-t-8 border-t-blue-600 relative overflow-hidden">
          <!-- Glass effect decorative elements -->
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl"></div>
          
          <div class="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 border-8 border-white shadow-xl shadow-emerald-500/10">
            <CreditCard :size="48" />
          </div>

          <h1 class="text-3xl font-black text-gray-900 mb-2">Konfirmasi Pembayaran</h1>
          <p class="text-gray-400 mb-10 font-bold uppercase text-[10px] tracking-[0.2em]">Sistem Pembayaran Aman</p>
          
          <div class="bg-gray-50/80 p-8 rounded-[2rem] text-left border border-gray-100 mb-10">
            <p class="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Ringkasan Tagihan</p>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-red-600 text-4xl font-black">Rp {{ cartStore.cartTotal.toLocaleString('id-ID') }}</p>
              </div>
              <p class="text-[10px] text-gray-400 font-bold italic">Terhitung PPN 11%</p>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200/50 space-y-3">
              <div class="flex items-center gap-3 text-xs text-blue-800 font-bold">
                 <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                 <span>Status: Menunggu Pembayaran</span>
              </div>
              <div class="flex items-center gap-3 text-xs text-blue-800 font-bold">
                 <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                 <span>Metode: Transfer Bank Virtual Account</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <button @click="processPayment" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-blue-400 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95 group">
               Bayar Sekarang
               <span class="inline-block group-hover:translate-x-1 transition ml-1">→</span>
            </button>
            <button @click="navigateTo('/cart')" class="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition text-sm">
              Batalkan & Kembali
            </button>
          </div>

          <div class="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition duration-500">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-4" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_danareksa.svg" alt="BNI" class="h-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CreditCard } from 'lucide-vue-next';
const cartStore = useCartStore();

const processPayment = () => {
  // We can add a sweet alert here later
  alert('Simulasi: Menghubungkan ke Bank...\nPembayaran Berhasil!');
  cartStore.clearCart();
  navigateTo('/orders');
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
