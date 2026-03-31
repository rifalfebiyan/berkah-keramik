<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore, formatCurrency, STATUS_CONFIG } from '@/composables/useAdminStore'

const emit = defineEmits<{ (e: 'navigate', tab: 'orders'): void }>()

const { products, orders, totalRevenue, pendingCount, lowStockCount, init } = useAdminStore()

onMounted(() => {
  init()
})

const statCards = computed(() => [
  {
    label: 'Total Pendapatan',
    value: formatCurrency(totalRevenue.value),
    sub: '+12% bulan ini',
    color: 'from-blue-500 to-blue-600',
    path: 'M12 8c-2.21 0-4 1.34-4 3s1.79 3 4 3 4 1.34 4 3-1.79 3-4 3m0-18v2m0 16v2',
  },
  {
    label: 'Total Produk',
    value: `${products.value.length} item`,
    sub: `${lowStockCount.value} stok menipis`,
    color: 'from-indigo-500 to-indigo-600',
    path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    label: 'Total Pesanan',
    value: `${orders.value.length} pesanan`,
    sub: `${pendingCount.value} menunggu`,
    color: 'from-purple-500 to-purple-600',
    path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
  {
    label: 'Pelanggan',
    value: `${orders.value.length} orang`,
    sub: '+5 bulan ini',
    color: 'from-green-500 to-green-600',
    path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
])

const lowStockProducts = computed(() =>
  [...products.value].filter(p => p.stock < 50).sort((a, b) => a.stock - b.stock).slice(0, 5)
)
</script>

<template>
  <div class="space-y-6">

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(card, i) in statCards"
        :key="i"
        class="bg-white rounded-2xl shadow-sm border p-5"
      >
        <div class="flex items-center justify-between mb-3">
          <div :class="`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white`">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="card.path" />
            </svg>
          </div>
          <!-- Trend arrow -->
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
        <p class="text-xl font-semibold text-gray-900">{{ card.value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ card.label }}</p>
        <p class="text-xs text-green-600 mt-1">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Recent orders + Low stock -->
    <div class="grid lg:grid-cols-3 gap-6">

      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Pesanan Terbaru</h2>
          <button
            @click="$emit('navigate', 'orders')"
            class="text-sm text-blue-600 hover:underline"
          >Lihat semua →</button>
        </div>

        <div class="space-y-1">
          <div
            v-for="order in orders.slice(0, 5)"
            :key="order.id"
            class="flex items-center justify-between py-3 border-b last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ order.customer }}</p>
              <p class="text-xs text-gray-500">INV-{{ String(order.id).padStart(5, '0') }} · {{ order.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-900">{{ formatCurrency(order.total) }}</p>
              <span :class="`text-xs px-2 py-0.5 rounded-full border inline-flex items-center gap-1 mt-1 ${STATUS_CONFIG[order.status].color}`">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="STATUS_CONFIG[order.status].icon" />
                </svg>
                {{ STATUS_CONFIG[order.status].label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock -->
      <div class="bg-white rounded-2xl shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900">Stok Menipis</h2>
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div class="space-y-3">
          <div
            v-for="p in lowStockProducts"
            :key="p.id"
            class="flex items-center justify-between"
          >
            <div class="min-w-0">
              <p class="text-sm text-gray-900 truncate max-w-[140px]">{{ p.name }}</p>
              <p class="text-xs text-gray-500">{{ p.category }}</p>
            </div>
            <span :class="`text-xs px-2 py-1 rounded-full font-medium ${p.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`">
              {{ p.stock }} m²
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>