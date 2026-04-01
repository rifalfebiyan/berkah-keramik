<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, Building2, Users, Activity, Settings,
  Crown, Shield, Zap, LogOut,
} from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'

const route = useRoute()
const emit   = defineEmits<{ (e: 'logout'): void }>()
const store  = useSuperAdminStore()

const navItems = [
  { id: 'overview',  label: 'Overview',          href: '/superadmin/overview',      icon: LayoutDashboard },
  { id: 'tenants',   label: 'Tenant / Toko',     href: '/superadmin/tenants',       icon: Building2 },
  { id: 'users',     label: 'Kelola Admin',      href: '/superadmin/users',         icon: Users },
  { id: 'categories', label: 'Master Kategori',   href: '/superadmin/categories',    icon: Shield },
  { id: 'subcategories', label: 'Master Subkategori', href: '/superadmin/subcategories', icon: Shield },
  { id: 'logs',      label: 'System Log',        href: '/superadmin/logs',          icon: Activity },
  { id: 'settings',  label: 'Pengaturan',        href: '/superadmin/settings',      icon: Settings },
]
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
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
          route.path === item.href
            ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
        ]"
      >
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </NuxtLink>
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
