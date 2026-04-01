<script setup lang="ts">
import CashierTab from '@/components/admin/CashierTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <CashierTab />
</template>
