<script setup lang="ts">
import CategoriesTab from '@/components/admin/CategoryTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <CategoriesTab />
</template>
