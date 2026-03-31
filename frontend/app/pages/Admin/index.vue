<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'admin'
})
import { ref } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import DashboardTab from '@/components/admin/DashboardTab.vue'
import ProductsTab from '@/components/admin/ProductsTab.vue'
import OrdersTab from '@/components/admin/OrdersTab.vue'
import CashierTab from '@/components/admin/CashierTab.vue'
import CategoryTab from '@/components/admin/CategoryTab.vue'
import SubcategoryTab from '@/components/admin/SubcategoryTab.vue'
import BrandTab from '@/components/admin/BrandTab.vue'

const activeTab = ref<'dashboard' | 'products' | 'brand' |'kategori' | 'subkategori' | 'orders' | 'cashier'>('dashboard')
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Fixed dark sidebar (w-64) -->
    <AdminSidebar v-model="activeTab" />

    <!-- Main area pushed right by sidebar width -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">

      <AdminHeader :active-tab="activeTab" />

      <main class="flex-1 p-8">
        <DashboardTab
          v-if="activeTab === 'dashboard'"
          @navigate="tab => activeTab = tab"
        />
        <ProductsTab v-else-if="activeTab === 'products'" />
        <OrdersTab   v-else-if="activeTab === 'orders'" />
        <CashierTab  v-else-if="activeTab === 'cashier'" />
        <BrandTab v-else-if="activeTab === 'brand'" />
        <CategoryTab v-else-if="activeTab === 'kategori'" />
        <SubcategoryTab v-else-if="activeTab === 'subkategori'" />
        
      </main>

    </div>
  </div>
</template>