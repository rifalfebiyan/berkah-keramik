<template>
  <div class="bg-gray-50/50 min-h-screen py-16">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Hasil Pencarian</h1>
            <p class="text-gray-500 mt-2 font-medium">
              Ditemukan hasil untuk: <strong class="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">"{{ searchQuery }}"</strong>
            </p>
          </div>
          <div class="hidden sm:block">
            <Search :size="48" class="text-gray-200" />
          </div>
        </div>

        <!-- Empty State / Mockup Data -->
        <div class="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl"></div>
          
          <div class="w-32 h-32 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 border-4 border-white shadow-inner animate-pulse">
            🔍
          </div>
          
          <h2 class="text-2xl font-black text-gray-900 mb-4 tracking-tight">Koneksi Data Belum Terhubung</h2>
          <p class="text-gray-500 max-w-sm mx-auto leading-relaxed mb-10 font-medium">
            Fitur pencarian real-time saat ini sedang dalam proses penyambungan ke API Basis Data Berkah Keramik.
          </p>
          
          <div class="flex flex-wrap justify-center gap-4">
            <button @click="navigateTo('/')" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition transform active:scale-95">
              Lihat Katalog Favorit
            </button>
            <button @click="navigateTo('/help')" class="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition">
              Butuh Bantuan?
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
const route = useRoute();
const searchQuery = computed(() => route.query.q || '');
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
