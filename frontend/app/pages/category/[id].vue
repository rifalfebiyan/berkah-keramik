<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Loading State -->
      <div v-if="isLoading && !category" class="py-20 text-center text-gray-400">
        <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat kategori...
      </div>

      <template v-else-if="category">
        <!-- Label Halaman -->
        <nav class="flex text-sm text-gray-400 mb-6 items-center gap-2 px-2">
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors font-semibold">Beranda</NuxtLink>
          <span class="text-gray-300">/</span>
          <span class="text-gray-600 font-bold whitespace-nowrap">{{ category.name }}</span>
        </nav>

        <div class="mb-10 px-2">
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ category.name }}</h1>
          <p class="text-gray-500 mt-1">Jelajahi berbagai sub-kategori {{ category.name.toLowerCase() }} berkualitas.</p>
        </div>

        <div v-if="categoryId" class="mt-8">
          <SubcategoryTab
            :categoryId="categoryId"
            @back="goBack"
          />
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="py-20 text-center">
        <div class="text-5xl mb-4 grayscale opacity-50">❌</div>
        <div class="text-gray-400 font-medium">Gagal memuat kategori</div>
        <button @click="fetchCategory" class="text-blue-600 mt-2 underline">Coba Lagi</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubcategoryTab from '~/components/SubcategoryTab.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const category = ref<any>(null);
const isLoading = ref(true);

const categoryId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return parseInt(id) || 1;
});

const fetchCategory = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch(`${config.public.apiUrl}/categories/${categoryId.value}`);
    category.value = data;
  } catch (err) {
    console.error('Failed to fetch category:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategory();
});

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
