<template>
  <div class="bg-gray-50/50 min-h-screen py-16">
    <div class="container">
      <div class="flex items-center gap-4 mb-10">
        <div class="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
          <ShoppingBag :size="24" />
        </div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Keranjang Belanja</h1>
      </div>
      
      <div v-if="cartStore.cartCount === 0" class="max-w-2xl mx-auto text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-500/5">
        <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 border-4 border-white shadow-inner">
          🛒
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-2">Keranjang Anda Kosong</h2>
        <p class="text-gray-500 mb-10 font-medium">Sepertinya Anda belum memilih produk apa pun.</p>
        <button @click="navigateTo('/')" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95">
          Mulai Belanja Sekarang
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cartStore.items.value" :key="item.id" class="group flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-[2rem] items-center shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
            <div class="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-50 relative">
              <img :src="item.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200'" 
                   :alt="item.name" 
                   class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            
            <div class="flex-1 text-center sm:text-left">
              <div class="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Mulia Ceramics</div>
              <h3 class="font-bold text-lg text-gray-900 leading-tight mb-2">{{ item.name }}</h3>
              <p class="text-red-600 font-black text-xl">Rp {{ item.price.toLocaleString('id-ID') }}</p>
            </div>

            <div class="flex items-center gap-6 flex-col sm:flex-row w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
              <div class="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-10 h-10 flex items-center justify-center font-black text-gray-400 hover:bg-white hover:text-blue-600 rounded-xl transition shadow-sm">-</button>
                <span class="w-10 text-center font-black text-gray-900">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-10 h-10 flex items-center justify-center font-black text-gray-400 hover:bg-white hover:text-blue-600 rounded-xl transition shadow-sm">+</button>
              </div>
              
              <button @click="cartStore.removeFromCart(item.id)" class="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition group/del" title="Hapus Produk">
                <Trash2 :size="20" class="group-hover/del:rotate-12 transition" />
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="lg:sticky lg:top-32">
          <div class="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <!-- Decorative circle -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <h3 class="text-2xl font-black mb-8 relative">Ringkasan Belanja</h3>
            
            <div class="space-y-4 mb-8 relative">
              <div class="flex justify-between items-center text-gray-400 font-medium">
                <span>Total Barang ({{ cartStore.cartCount }})</span>
                <span class="text-white">Rp {{ cartStore.cartTotal.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-400 font-medium">
                <span>Biaya Admin</span>
                <span class="text-emerald-400 font-bold">GRATIS</span>
              </div>
              <div class="h-px bg-white/10 my-6"></div>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Tagihan</p>
                  <p class="text-3xl font-black text-white">Rp {{ cartStore.cartTotal.toLocaleString('id-ID') }}</p>
                </div>
              </div>
            </div>

            <button @click="navigateTo('/checkout')" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-500 hover:-translate-y-1 transition transform active:scale-95 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 relative">
              <span>Checkout Sekarang</span>
              <ChevronRight :size="20" />
            </button>
            
            <p class="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-tighter">
              🔒 Transaksi Aman & Terenkripsi
            </p>
          </div>
          
          <button @click="navigateTo('/')" class="w-full mt-6 py-4 text-gray-500 font-bold hover:text-blue-600 transition flex items-center justify-center gap-2">
            <span>← Lanjut Belanja</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingBag, Trash2, ChevronRight } from 'lucide-vue-next';
const cartStore = useCartStore();
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
