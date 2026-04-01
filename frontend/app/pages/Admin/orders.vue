<script setup lang="ts">
import OrdersTab from '@/components/admin/OrdersTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <OrdersTab />
</template>
