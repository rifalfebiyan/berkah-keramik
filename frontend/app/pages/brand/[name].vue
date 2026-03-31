<template>
  <div>
    <BrandProductListView
      :brand="brandName"
      @back="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BrandProductListView from '~/components/BrandProductListView.vue';

const route = useRoute();
const router = useRouter();

const brandName = computed(() => {
  const brand = route.params.name;
  return Array.isArray(brand) ? brand[0] : brand;
});

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
