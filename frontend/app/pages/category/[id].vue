<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Label Halaman -->
      <nav class="flex text-sm text-gray-400 mb-6 items-center gap-2 px-2">
        <NuxtLink to="/" class="hover:text-blue-600">Beranda</NuxtLink>
        <span>/</span>
        <span class="text-gray-600 font-medium whitespace-nowrap">Koleksi Kategori</span>
      </nav>

      <div class="mb-10 px-2">
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Katalog Pilihan</h1>
        <p class="text-gray-500 mt-1">Jelajahi berbagai sub-kategori material bangunan berkualitas tinggi.</p>
      </div>

      <div v-if="categoryId" class="mt-8">
        <SubcategoryTab
          :categoryId="categoryId"
          @back="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubcategoryTab from '~/components/SubcategoryTab.vue';

const route = useRoute();
const router = useRouter();

const categoryId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return parseInt(id) || 1;
});

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
