<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminStore, formatCurrency, STATUS_CONFIG, type OrderStatus } from '@/composables/useAdminStore'

const { orders, updateOrderStatus, init } = useAdminStore()

onMounted(() => {
  init()
})

// ── Search & Filter ───────────────────────────────────────────────────────────
const search     = ref('')
const statusFilter = ref<'all' | OrderStatus>('all')

const filteredOrders = computed(() =>
  orders.value.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.value.toLowerCase()) ||
      String(o.id).includes(search.value)
    const matchStatus = statusFilter.value === 'all' || o.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

// ── Expandable rows ───────────────────────────────────────────────────────────
const expanded = ref<Set<number>>(new Set())
function toggleExpand(id: number) {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}

// ── Print modal ───────────────────────────────────────────────────────────────
const printOrder = ref<typeof orders.value[0] | null>(null)

const STATUS_KEYS = Object.keys(STATUS_CONFIG) as OrderStatus[]
</script>

<template>
  <div class="space-y-4">

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="search"
          placeholder="Cari pesanan atau pelanggan..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="all">Semua Status</option>
        <option v-for="key in STATUS_KEYS" :key="key" :value="key">{{ STATUS_CONFIG[key].label }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="w-8 py-3 px-2"></th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">No. Pesanan</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Pelanggan</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Produk</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Total</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Status</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Tanggal</th>
              <th class="text-left py-3 px-4 text-sm text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in filteredOrders" :key="order.id">
              <!-- Main row -->
              <tr class="border-b hover:bg-gray-50 transition">
                <!-- Expand toggle -->
                <td class="py-3 px-2">
                  <button
                    v-if="(order.items?.length ?? 0) > 1"
                    @click="toggleExpand(order.id)"
                    class="p-1 text-gray-400 hover:text-gray-700 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        :d="expanded.has(order.id) ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                    </svg>
                  </button>
                </td>
                <td class="py-3 px-4 text-sm text-blue-600 font-medium">
                  INV-{{ String(order.id).padStart(5, '0') }}
                </td>
                <td class="py-3 px-4">
                  <p class="text-sm text-gray-900">{{ order.customer }}</p>
                  <p v-if="order.phone" class="text-xs text-gray-500">{{ order.phone }}</p>
                </td>
                <td class="py-3 px-4">
                  <p class="text-sm text-gray-900 max-w-[180px] truncate">
                    {{ order.items?.[0]?.productName || 'No items' }}
                    {{ (order.items?.length ?? 0) > 1 ? '...' : '' }}
                  </p>
                  <p v-if="(order.items?.length ?? 0) > 1" class="text-xs text-gray-400">{{ order.items!.length }} item</p>
                </td>
                <td class="py-3 px-4 text-sm text-gray-900">
                  {{ formatCurrency(order.total * 1.11) }}
                </td>
                <td class="py-3 px-4">
                  <span :class="`text-xs px-2 py-1 rounded-full border inline-flex items-center gap-1 ${STATUS_CONFIG[order.status].color}`">
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="STATUS_CONFIG[order.status].icon" />
                    </svg>
                    {{ STATUS_CONFIG[order.status].label }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-500">{{ order.date }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-1">
                    <!-- Print -->
                    <button @click="printOrder = order" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Lihat Nota">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <!-- Status select -->
                    <select
                      :value="order.status"
                      @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value as OrderStatus)"
                      class="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option v-for="key in STATUS_KEYS" :key="key" :value="key">{{ STATUS_CONFIG[key].label }}</option>
                    </select>
                  </div>
                </td>
              </tr>

              <!-- Expanded item rows -->
              <template v-if="expanded.has(order.id) && order.items">
                <tr
                  v-for="(item, idx) in order.items"
                  :key="`${order.id}-item-${idx}`"
                  class="bg-blue-50/50 border-b"
                >
                  <td class="py-2 px-2"></td>
                  <td class="py-2 px-4 text-xs text-gray-400 pl-6">└ Item {{ idx + 1 }}</td>
                  <td></td>
                  <td class="py-2 px-4 text-sm text-gray-700">{{ item.productName }}</td>
                  <td class="py-2 px-4" colspan="4">
                    <span class="text-xs text-gray-600">
                      {{ formatCurrency(item.pricePerUnit) }} × {{ item.quantity }} m²
                      <span class="ml-2 text-gray-900 font-medium">= {{ formatCurrency(item.total) }}</span>
                    </span>
                  </td>
                </tr>
              </template>
            </template>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="py-10 text-center text-gray-500 text-sm">Tidak ada pesanan ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Print Modal (simple) -->
    <Teleport to="body">
      <div v-if="printOrder" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="font-semibold text-gray-900">Detail Pesanan</h3>
            <button @click="printOrder = null" class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">No. Pesanan</span>
              <span class="font-medium text-blue-600">INV-{{ String(printOrder.id).padStart(5, '0') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Pelanggan</span>
              <span class="text-gray-900">{{ printOrder.customer }}</span>
            </div>
            <div v-if="printOrder.phone" class="flex justify-between">
              <span class="text-gray-500">Telepon</span>
              <span class="text-gray-900">{{ printOrder.phone }}</span>
            </div>
            <div v-if="printOrder.address" class="flex justify-between">
              <span class="text-gray-500">Alamat</span>
              <span class="text-gray-900 text-right max-w-[200px]">{{ printOrder.address }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tanggal</span>
              <span class="text-gray-900">{{ printOrder.date }}</span>
            </div>
            <div class="border-t pt-3 space-y-2">
              <div v-for="(item, i) in printOrder.items" :key="i" class="flex justify-between">
                <span class="text-gray-700 max-w-[180px]">{{ item.productName }} × {{ item.quantity }} m²</span>
                <span class="text-gray-900">{{ formatCurrency(item.total) }}</span>
              </div>
            </div>
            <div class="border-t pt-3 space-y-1">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{{ formatCurrency(printOrder.total) }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Pajak (11%)</span>
                <span>{{ formatCurrency(printOrder.total * 0.11) }}</span>
              </div>
              <div class="flex justify-between font-semibold text-gray-900 text-base border-t pt-2">
                <span>Total</span>
                <span class="text-blue-600">{{ formatCurrency(printOrder.total * 1.11) }}</span>
              </div>
            </div>
          </div>
          <div class="p-4 border-t flex gap-3">
            <button @click="printOrder = null" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm">Tutup</button>
            <button onclick="window.print()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">🖨 Cetak</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
