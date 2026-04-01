<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-7xl">
    <!-- Breadcrumb -->
    <nav class="flex text-sm text-gray-400 mb-6 items-center gap-2 px-2">
      <NuxtLink to="/" class="hover:text-blue-600 transition-colors">Beranda</NuxtLink>
      <span class="text-gray-300">/</span>
      <NuxtLink to="/category/1" class="hover:text-blue-600">Koleksi Kategori</NuxtLink>
      <span class="text-gray-300">/</span>
      <span class="text-gray-600 font-medium">Subkategori #{{ subcategoryId }}</span>
    </nav>

    <div class="mb-10 px-2 border-b border-gray-100 pb-8">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">Koleksi Subkategori {{ subcategoryId }}</h1>
      <p class="text-gray-500 mt-1">Temukan berbagai varian keramik dan granit berkualitas tinggi untuk menyempurnakan setiap sudut hunian Anda.</p>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
      <div v-for="i in 10" :key="i" class="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group" @click="navigateTo('/product/1')">
        <div class="aspect-square bg-gray-100 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1517646281694-2226b1445771?auto=format&fit=crop&q=80&w=400" alt="Mock" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">TERLARIS</span>
        </div>
        <div class="p-3">
          <div class="text-[10px] text-gray-500 font-bold mb-1 uppercase">Merek {{ i }}</div>
          <h3 class="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">Keramik Dinding Pola Menarik Tipe {{ i }}</h3>
          <div class="text-red-600 font-bold">Rp {{ (45000 + (i * 5000)).toLocaleString('id-ID') }}</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const subcategoryId = computed(() => route.params.id);
</script>

<style scoped>
/* Removed scoped container to use Tailwind classes consistently with category page */
</style>
