<script setup lang="ts">
import ProductsTab from '@/components/admin/ProductsTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <ProductsTab />
</template>
