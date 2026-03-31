<script setup lang="ts">
const props = defineProps<{
  activeTab: 'dashboard' | 'products' | 'kategori' | 'subkategori' | 'brand' | 'orders' | 'cashier'
}>()

const tabLabel: Record<string, string> = {
  dashboard: 'Dashboard',
  kategori:  'Manajemen Kategori',
  subkategori: 'Manajemen Subkategori',
  brand:     'Manajemen Brand',
  products:  'Manajemen Produk',
  orders:    'Manajemen Pesanan',
  cashier:   'Kasir',
}
</script>

<template>
  <header class="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-20">
    <div>
      <h1 class="text-lg font-semibold text-gray-900">{{ tabLabel[activeTab] }}</h1>
      <p class="text-sm text-gray-500">Selamat datang kembali, Admin!</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-sm font-medium text-gray-900">Administrator</p>
        <p class="text-xs text-gray-500">admin@berkahkeramik.com</p>
      </div>
      <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-bold">A</span>
      </div>
    </div>
  </header>
</template>