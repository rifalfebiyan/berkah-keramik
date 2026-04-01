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
      <div v-if="isLoading" class="col-span-full py-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat produk...
      </div>
      <div v-else-if="products.length === 0" class="col-span-full py-12 text-center">
        <div class="text-4xl mb-4 text-gray-200">📦</div>
        <div class="text-gray-400 font-medium">Belum ada produk untuk subkategori ini</div>
        <NuxtLink to="/" class="text-blue-600 mt-2 inline-block hover:underline">Kembali ke Beranda</NuxtLink>
      </div>
      <div 
        v-else
        v-for="p in products" 
        :key="p.id" 
        class="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group" 
        @click="navigateTo(`/product/${p.id}`)"
      >
        <div class="aspect-square bg-gray-100 overflow-hidden relative flex items-center justify-center">
          <img 
            v-if="p.imageUrl"
            :src="p.imageUrl" 
            :alt="p.name" 
            class="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
          />
          <div v-else class="flex flex-col items-center text-gray-300">
            <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-[10px] font-bold uppercase tracking-wider">No Image</span>
          </div>
          <span v-if="p.isFlashSale" class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">FLASH SALE</span>
        </div>
        <div class="p-3">
          <div class="text-[10px] text-gray-500 font-bold mb-1 uppercase">{{ p.brand?.name || 'Merek Umum' }}</div>
          <h3 class="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{{ p.name }}</h3>
          <div class="text-red-600 font-bold">Rp {{ p.price.toLocaleString('id-ID') }}</div>
          <div v-if="p.oldPrice" class="text-[10px] text-gray-400 line-through">Rp {{ p.oldPrice.toLocaleString('id-ID') }}</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const config = useRuntimeConfig();
const subcategoryId = computed(() => route.params.id);
const products = ref([]);
const isLoading = ref(true);

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch(`${config.public.apiUrl}/products?subcategoryId=${subcategoryId.value}`);
    products.value = data;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Removed scoped container to use Tailwind classes consistently with category page */
</style>
