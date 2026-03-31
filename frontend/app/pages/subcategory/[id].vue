<template>
  <div class="container py-12 min-h-[70vh]">
    <!-- Breadcrumb -->
    <nav class="flex text-sm text-gray-500 mb-8 items-center gap-2">
      <NuxtLink to="/" class="hover:text-blue-600">Beranda</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-medium">Subkategori #{{ subcategoryId }}</span>
    </nav>

    <div class="mb-8 border-b pb-6">
      <h1 class="text-3xl font-bold text-gray-900">Koleksi Subkategori {{ subcategoryId }}</h1>
      <p class="text-gray-500 mt-2">Temukan berbagai varian keramik dan granit berkualitas di kategori ini.</p>
    </div>

    <!-- Product Grid Mockup -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="i in 10" :key="i" class="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group" @click="navigateTo('/product/1')">
        <div class="aspect-square bg-gray-100 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1517646281694-2226b1445771?auto=format&fit=crop&q=80&w=400" alt="Mock" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
          <span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">TERLARIS</span>
        </div>
        <div class="p-3">
          <div class="text-[10px] text-gray-500 font-bold mb-1">MEREK {{ i }}</div>
          <h3 class="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600">Keramik Dinding Pola Menarik Tipe {{ i }}</h3>
          <div class="text-red-600 font-bold">Rp {{ (45000 + (i * 5000)).toLocaleString('id-ID') }}</div>
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
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
