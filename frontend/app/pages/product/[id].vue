<template>
  <div class="product-page">
    <div v-if="pending" class="flex items-center justify-center min-h-[400px]">
       <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full font-bold"></div>
    </div>
    <div v-else-if="error" class="text-center py-20 px-4">
       <div class="text-red-500 mb-4">Gagal memuat produk.</div>
       <button @click="() => refresh()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Coba Lagi</button>
    </div>
    <div v-else-if="product">
      <ProductDetailView
        :product="product"
        @back="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductDetailView from '~/components/ProductDetailView.vue';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const { data: product, pending, error, refresh } = await useApiFetch<any>(`/products/${route.params.id}`);

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
