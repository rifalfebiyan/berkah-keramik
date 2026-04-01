<script setup lang="ts">
import DashboardTab from '@/components/admin/DashboardTab.vue'

definePageMeta({ 
  layout: 'admin',
  middleware: 'admin'
})

// Handle inner navigation from dashboard stats
const handleNavigate = (tab: string) => {
  const routeMap: Record<string, string> = {
    products: '/admin/products',
    orders: '/admin/orders',
    cashier: '/admin/cashier',
    brand: '/admin/brands',
    kategori: '/admin/categories',
    subkategori: '/admin/subcategories'
  }
  const target = routeMap[tab] || '/admin/dashboard'
  navigateTo(target)
}
</script>

<template>
  <DashboardTab @navigate="handleNavigate" />
</template>
