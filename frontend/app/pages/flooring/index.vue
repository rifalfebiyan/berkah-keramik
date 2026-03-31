<template>
  <div>
    <FlooringProductListingView @back="goBack" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import FlooringProductListingView from '~/components/FlooringProductListingView.vue';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
