<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumbs Nav Bar -->
    <div class="bg-white border-b border-gray-200 py-3 mb-8">
      <div class="container mx-auto px-4 max-w-7xl">
        <nav class="flex text-xs md:text-sm text-gray-400 items-center gap-2 md:gap-3">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors font-semibold">Beranda</NuxtLink>
          <span class="text-gray-300 font-light">|</span>
          <NuxtLink v-if="subcategory?.category" :to="`/category/${subcategory.category.id}`" class="hover:text-blue-600 font-semibold truncate max-w-[100px] md:max-w-none">
            {{ subcategory.category.name }}
          </NuxtLink>
          <span v-if="subcategory?.category" class="text-gray-200">/</span>
          <span class="text-red-600 font-bold truncate">
            {{ subcategory?.name || 'Memuat...' }}
          </span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-7xl">
      <div v-if="!isLoading && subcategory" class="mb-10 border-b border-gray-100 pb-8">
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Koleksi {{ subcategory.name }}</h1>
        <p class="text-gray-500 mt-1">Jelajahi berbagai pilihan {{ subcategory.name.toLowerCase() }} berkualitas untuk kebutuhan bangunan Anda.</p>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <div v-if="isLoading" class="col-span-full py-20 text-center text-gray-400">
          <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          Memuat produk...
        </div>
        <div v-else-if="products.length === 0" class="col-span-full py-16 text-center">
          <div class="text-5xl mb-4 grayscale opacity-50">📦</div>
          <div class="text-gray-500 font-bold text-xl">Belum ada produk</div>
          <p class="text-gray-400 mt-1 mb-6 text-sm">Produk untuk koleksi ini sedang disiapkan.</p>
          <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition">Kembali ke Beranda</NuxtLink>
        </div>
        <div 
          v-else
          v-for="p in products" 
          :key="p.id" 
          class="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" 
          @click="navigateTo(`/product/${p.id}`)"
        >
          <div class="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
            <span v-if="p.discount" class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded z-10 shadow-sm">-{{ p.discount }}%</span>
            <img 
              v-if="p.imageUrl"
              :src="p.imageUrl" 
              :alt="p.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div v-else class="flex flex-col items-center text-gray-200">
              <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-[8px] font-black uppercase tracking-widest">No Image</span>
            </div>
            <div v-if="p.isFlashSale" class="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-black text-center py-1">FLASH SALE</div>
          </div>
          <div class="p-4">
            <div class="text-[9px] text-red-600 font-extrabold mb-1 uppercase tracking-wider">{{ p.brand?.name || 'Merek Umum' }}</div>
            <h3 class="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-3 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">{{ p.name }}</h3>
            <div class="flex items-baseline gap-2">
              <div class="text-blue-600 font-black text-base">Rp {{ p.price.toLocaleString('id-ID') }}</div>
              <div v-if="p.oldPrice" class="text-[10px] text-gray-400 line-through">Rp {{ p.oldPrice.toLocaleString('id-ID') }}</div>
            </div>
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
const subcategory = ref(null);
const products = ref([]);
const isLoading = ref(true);

const fetchData = async () => {
  isLoading.value = true;
  try {
    // 1. Fetch subcategory details
    const subData = await $fetch(`${config.public.apiUrl}/subcategories/${subcategoryId.value}`);
    subcategory.value = subData;

    // 2. Fetch products for this subcategory
    const prodData = await $fetch(`${config.public.apiUrl}/products?subcategoryId=${subcategoryId.value}`);
    products.value = prodData;
  } catch (err) {
    console.error('Failed to fetch data:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Unified with global styles and Tailwind */
</style>
