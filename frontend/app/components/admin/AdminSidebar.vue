<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/composables/useAdminStore'

const model = defineModel<'dashboard' | 'kategori' | 'subkategori' | 'brand' | 'products' | 'orders' | 'cashier'>()

const { pendingCount, lowStockCount } = useAdminStore()

const navItems = [
  {
    id: 'dashboard' as const,
    label: 'Dashboard',
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'kategori' as const,
    label: 'Kategori',
    path: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    id: 'subkategori' as const,
    label: 'Subkategori',
    path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    id: 'brand' as const,
    label: 'Brand',
    path: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    id: 'products' as const,
    label: 'Produk',
    path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    id: 'orders' as const,
    label: 'Pesanan',
    path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
  {
    id: 'cashier' as const,
    label: 'Kasir',
    path: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
]
</script>

<template>
  <aside class="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col fixed inset-y-0 z-30">

    <!-- Logo -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <span class="text-white text-sm font-bold">BK</span>
        </div>
        <div>
          <p class="text-white text-sm font-semibold">Berkah Keramik</p>
          <p class="text-gray-400 text-xs">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-4 space-y-1">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="model = item.id"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
          model === item.id
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'text-gray-400 hover:bg-gray-700 hover:text-white',
        ]"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.path" />
        </svg>
        {{ item.label }}

        <!-- Badge: orders -->
        <span
          v-if="item.id === 'orders' && pendingCount > 0"
          class="ml-auto bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full"
        >{{ pendingCount }}</span>

        <!-- Badge: products -->
        <span
          v-if="item.id === 'products' && lowStockCount > 0"
          class="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
        >{{ lowStockCount }}</span>
      </button>
    </nav>

    <!-- Logout -->
    <div class="p-4 border-t border-gray-700">
      <NuxtLink to="/" class="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-600/20 rounded-xl text-sm transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Kembali ke Toko
      </NuxtLink>
    </div>

  </aside>
</template>