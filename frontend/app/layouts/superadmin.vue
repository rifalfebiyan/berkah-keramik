<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Crown, AlertTriangle } from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'
import SASidebar from '@/components/superadmin/SASidebar.vue'

const route = useRoute()
const store = useSuperAdminStore()

const tabTitle: Record<string, string> = {
  overview: 'System Overview',
  tenants:  'Kelola Tenant / Toko',
  users:    'Kelola Admin Users',
  categories: 'Master Kategori',
  subcategories: 'Master Subkategori',
  logs:     'System Activity Log',
  settings: 'System Settings',
}

// Map route path to tab ID for header title
const activeTab = computed(() => {
  const path = route.path
  if (path === '/superadmin/tenants') return 'tenants'
  if (path === '/superadmin/users') return 'users'
  if (path === '/superadmin/categories') return 'categories'
  if (path === '/superadmin/subcategories') return 'subcategories'
  if (path === '/superadmin/logs') return 'logs'
  if (path === '/superadmin/settings') return 'settings'
  return 'overview'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <SASidebar />

    <!-- Main Content Area -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div>
          <h1 class="text-gray-900 flex items-center gap-2">
            <Crown :size="18" class="text-violet-500" />
            {{ tabTitle[activeTab] || 'Super Admin Panel' }}
          </h1>
          <p class="text-gray-400 text-xs mt-0.5">Berkah Keramik Platform — Super Admin Panel</p>
        </div>
        <div class="flex items-center gap-3">
          <span
            v-if="store.maintenanceMode.value"
            class="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-full flex items-center gap-1.5"
          >
            <AlertTriangle :size="12" />
            Maintenance Mode ON
          </span>
          <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm shadow-violet-200">
            <Crown :size="13" class="text-white" />
          </div>
        </div>
      </header>

      <main class="flex-1 p-8">
        <slot />
      </main>

    </div>
  </div>
</template>
