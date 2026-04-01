<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const route = useRoute()

// Map the route name or path to the active tab ID for the header
const activeTab = computed(() => {
  const path = route.path
  if (path === '/admin/products') return 'products'
  if (path === '/admin/orders') return 'orders'
  if (path === '/admin/cashier') return 'cashier'
  if (path === '/admin/brands') return 'brand'
  if (path === '/admin/categories') return 'kategori'
  if (path === '/admin/subcategories') return 'subkategori'
  return 'dashboard'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content Area -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <AdminHeader :active-tab="activeTab" />
      
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
