<script setup lang="ts">
import { ref } from 'vue'
import { Crown, AlertTriangle } from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'
import SASidebar      from '@/components/superadmin/SASidebar.vue'
import SAOverviewTab  from '@/components/superadmin/SAOverviewTab.vue'
import SATenantsTab   from '@/components/superadmin/SATenantsTab.vue'
import SAUsersTab     from '@/components/superadmin/SAUsersTab.vue'
import SALogsTab      from '@/components/superadmin/SALogsTab.vue'
import SASettingsTab  from '@/components/superadmin/SASettingsTab.vue'
import SACategoryTab from '@/components/superadmin/SACategoryTab.vue'
import SASubcategoryTab from '@/components/superadmin/SASubcategoryTab.vue'

definePageMeta({ 
  layout: false,
  middleware: 'superadmin'
})

type Tab = 'overview' | 'tenants' | 'users' | 'categories' | 'subcategories' | 'logs' | 'settings'

const activeTab = ref<Tab>('overview')
const store     = useSuperAdminStore()

const tabTitle: Record<Tab, string> = {
  overview: 'System Overview',
  tenants:  'Kelola Tenant / Toko',
  users:    'Kelola Admin Users',
  categories: 'Master Kategori',
  subcategories: 'Master Subkategori',
  logs:     'System Activity Log',
  settings: 'System Settings',
}

function handleLogout() {
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar -->
    <SASidebar v-model="activeTab" @logout="handleLogout" />

    <!-- Main Content -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">

      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div>
          <h1 class="text-gray-900 flex items-center gap-2">
            <Crown :size="18" class="text-violet-500" />
            {{ tabTitle[activeTab] }}
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

      <!-- Tab Content -->
      <main class="flex-1 p-8">
        <SAOverviewTab
          v-if="activeTab === 'overview'"
          @navigate="(tab) => activeTab = tab"
        />
        <SATenantsTab v-else-if="activeTab === 'tenants'" />
        <SAUsersTab   v-else-if="activeTab === 'users'" />
        <SALogsTab    v-else-if="activeTab === 'logs'" />
        <SASettingsTab v-else-if="activeTab === 'settings'" />
        <SACategoryTab v-else-if="activeTab === 'categories'" />
        <SASubcategoryTab v-else-if="activeTab === 'subcategories'" />
      </main>

    </div>
  </div>
</template>
