<script setup lang="ts">
import SubcategoryTab from '@/components/admin/SubcategoryTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <SubcategoryTab />
</template>
