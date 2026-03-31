<template>
  <div class="bg-gray-50/50 min-h-screen py-16">
    <div class="container">
      <div class="flex items-center gap-4 mb-10">
        <div class="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200">
          <Heart :size="24" />
        </div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Favorit Saya</h1>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Empty State -->
        <div class="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-xl shadow-red-500/5 overflow-hidden relative">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-50/50 rounded-full blur-2xl"></div>
          
          <div class="w-32 h-32 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 border-4 border-white shadow-inner animate-pulse">
            ❤️
          </div>
          <h2 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">Koleksi Masih Kosong</h2>
          <p class="text-gray-500 mb-10 font-medium max-w-sm mx-auto">Simpan produk impian Anda agar mudah ditemukan saat Anda siap memilikinya.</p>
          
          <div class="flex justify-center gap-4">
             <button @click="navigateTo('/')" class="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition transform active:scale-95">
                Cari Produk
             </button>
             <button @click="navigateTo('/about')" class="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition">
                Tentang Kami
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Heart } from 'lucide-vue-next';
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
