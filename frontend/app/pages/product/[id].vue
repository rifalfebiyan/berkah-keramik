<template>
  <div v-if="product">
    <ProductDetailView
      :productPreview="product"
      @back="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductDetailView from '~/components/ProductDetailView.vue';

const route = useRoute();
const router = useRouter();

// Minimal mock product payload passed to the component,
// ideally the component fetches detailed info using the ID,
// but to maintain compatibility we mock the initial pass.
const product = ref({
  id: route.params.id,
  name: 'Product ' + route.params.id
});

const goBack = () => {
  // Use router history if possible, else go to home
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
