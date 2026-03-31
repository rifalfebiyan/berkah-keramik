<template>
  <div class="bg-gray-50/50 min-h-screen py-24">
    <div class="container">
      <div class="max-w-6xl mx-auto">
        <header class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div class="space-y-4 text-center md:text-left">
            <h1 class="text-5xl font-black text-gray-900 tracking-tighter">Lokasi Toko Kami</h1>
            <p class="text-blue-600 font-bold tracking-widest text-sm uppercase">Kunjungi Showroom Terdekat Anda</p>
          </div>
          <div class="relative w-full md:w-96 group">
            <input type="text" placeholder="Cari kota atau area terdekat..." class="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-medium" />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Search :size="20" />
            </span>
          </div>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="(loc, index) in locations" :key="index" class="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_40px_80px_rgba(30,58,138,0.08)] transition-all duration-500 group">
            <div class="h-64 relative overflow-hidden">
               <img :src="loc.image" :alt="loc.name" class="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
               <div class="absolute bottom-6 left-6 text-white">
                  <div class="text-[10px] uppercase font-black tracking-widest text-blue-300 mb-1">Kota Cabang</div>
                  <div class="text-2xl font-black">{{ loc.city }}</div>
               </div>
            </div>
            
            <div class="p-8 space-y-6">
              <div>
                <h3 class="font-black text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition tracking-tight">{{ loc.name }}</h3>
                <p class="text-sm text-gray-400 font-medium leading-relaxed italic line-clamp-2">📍 {{ loc.address }}</p>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-[10px] text-emerald-600 font-black bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-tighter shadow-inner shadow-emerald-500/5">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Buka Sekarang</span>
                </div>
                <p class="text-[10px] text-gray-400 font-bold">08:00 - 20:00</p>
              </div>

              <button class="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black hover:bg-blue-600 hover:-translate-y-1 transition transform active:scale-95 shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3">
                <span>Dapatkan Petunjuk Arah</span>
                <ChevronRight :size="16" />
              </button>
            </div>
          </div>
        </section>

        <section class="mt-24 text-center">
          <div class="inline-flex flex-col items-center gap-8 bg-blue-50 p-12 md:p-20 rounded-[4rem] border border-blue-100/50 shadow-inner relative overflow-hidden group/info">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-2xl group-hover/info:scale-110 transition duration-700"></div>
            
            <div class="text-6xl animate-bounce">🚚</div>
            <div class="max-w-2xl">
               <h2 class="text-3xl font-black text-blue-900 mb-4 tracking-tight">Tidak Ada Toko di Lokasi Anda?</h2>
               <p class="text-blue-700/80 font-medium leading-relaxed mb-10">Berkah Keramik melayani pengiriman logistik khusus ke seluruh pelosok Nusantara dengan jaminan barang sampai tanpa pecah satu keping pun.</p>
               <button @click="navigateTo('/')" class="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-blue-300 hover:bg-blue-700 hover:-translate-y-1 transition transform scale-105 active:scale-100">
                 Belanja Online Sekarang
               </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, ChevronRight } from 'lucide-vue-next';
const locations = [
  { name: 'Showroom Pusat Tangerang', city: 'Tangerang', address: 'Jl. Raya Serpong No. 123, Pakulonan, Kec. Serpong, Kota Tangerang Selatan', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=400' },
  { name: 'Berkah Keramik Bekasi', city: 'Bekasi', address: 'Kawasan Harapan Indah Blok B2 No. 45, Medan Satria, Kota Bekasi', image: 'https://images.unsplash.com/photo-1512411221-83959bc142ab?auto=format&fit=crop&q=80&w=400' },
  { name: 'Depo Keramik Depok', city: 'Depok', address: 'Jl. Margonda Raya No. 495, Pondok Cina, Beji, Kota Depok', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400' },
];
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
