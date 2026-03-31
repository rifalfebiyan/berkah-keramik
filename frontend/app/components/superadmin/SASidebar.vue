<script setup lang="ts">
import {
  LayoutDashboard, Building2, Users, Activity, Settings,
  Crown, Shield, Zap, LogOut,
} from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'

type Tab = 'overview' | 'tenants' | 'users' | 'categories' | 'subcategories' | 'logs' | 'settings'

const model  = defineModel<Tab>()
const emit   = defineEmits<{ (e: 'logout'): void }>()
const store  = useSuperAdminStore()

const navItems = [
  { id: 'overview'  as Tab, label: 'Overview',     icon: LayoutDashboard },
  { id: 'tenants'   as Tab, label: 'Tenant / Toko', icon: Building2 },
  { id: 'users'     as Tab, label: 'Kelola Admin',  icon: Users },
  { id: 'categories' as Tab, label: 'Master Kategori', icon: Shield },
  { id: 'subcategories' as Tab, label: 'Master Subkategori', icon: Shield },
  { id: 'logs'      as Tab, label: 'System Log',    icon: Activity },
  { id: 'settings'  as Tab, label: 'Pengaturan',    icon: Settings },
] as const
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-30 shadow-sm">

    <!-- Logo -->
    <div class="p-5 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
          <Crown :size="18" class="text-white" />
        </div>
        <div>
          <p class="text-gray-900 text-sm">Super Admin</p>
          <p class="text-violet-500 text-xs flex items-center gap-1">
            <Shield :size="10" /> System Access
          </p>
        </div>
      </div>
    </div>

    <!-- Badge -->
    <div class="mx-4 mt-4 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
      <p class="text-xs text-violet-600 flex items-center gap-1.5">
        <Zap :size="12" class="text-violet-500" />
        Full System Control
      </p>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-4 space-y-0.5 mt-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="model = item.id"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
          model === item.id
            ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
        ]"
      >
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </button>
    </nav>

    <!-- User Info + Logout -->
    <div class="p-4 border-t border-gray-100 space-y-2">
      <div class="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-xl">
        <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs">SA</span>
        </div>
        <div class="min-w-0">
          <p class="text-gray-800 text-xs truncate">Super Admin</p>
          <p class="text-gray-400 text-xs truncate">superadmin@system.com</p>
        </div>
      </div>
      <button
        @click="emit('logout')"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm transition"
      >
        <LogOut :size="16" />
        Keluar
      </button>
    </div>

  </aside>
</template>
