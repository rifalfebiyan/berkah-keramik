<script setup lang="ts">
import BrandTab from '@/components/admin/BrandTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <BrandTab />
</template>
