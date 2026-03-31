<template>
  <div v-if="categoryId">
    <SubcategoryTab
      :categoryId="categoryId"
      @back="goBack"
    />
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
