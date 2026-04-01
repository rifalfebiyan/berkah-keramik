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
    <!-- Header & Toolbar -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Pesanan</h2>
        <p class="text-sm text-gray-400 mt-1">{{ filteredOrders.length }} pesanan ditemukan</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <div class="relative group flex-1 sm:min-w-[300px]">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="search"
            placeholder="Cari pesanan atau pelanggan..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-colors text-sm"
          />
        </div>
        
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-colors text-sm font-medium"
        >
          <option value="all">Semua Status</option>
          <option v-for="key in STATUS_KEYS" :key="key" :value="key">{{ STATUS_CONFIG[key].label }}</option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <!-- Scrollable Table Wrapper -->
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-2 py-3 w-10 text-center"></th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">No. Pesanan</th>
              <th class="px-4 py-3 font-semibold">Pelanggan</th>
              <th class="px-4 py-3 font-semibold">Produk</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Total</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Tanggal</th>
              <th class="px-4 py-3 font-semibold text-right whitespace-nowrap sticky right-0 bg-gray-50">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <template v-for="order in filteredOrders" :key="order.id">
              <!-- Main row -->
              <tr class="hover:bg-blue-50/30 transition-colors group">
                <!-- Expand toggle -->
                <td class="px-2 py-3 text-center">
                  <button
                    v-if="(order.items?.length ?? 0) > 1"
                    @click="toggleExpand(order.id)"
                    class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg 
                      class="w-4 h-4 transform transition-transform" 
                      :class="{ 'rotate-180': expanded.has(order.id) }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </td>
                
                <!-- No Pesanan -->
                <td class="px-4 py-3 font-bold text-blue-600 whitespace-nowrap">
                  INV-{{ String(order.id).padStart(5, '0') }}
                </td>
                
                <!-- Pelanggan -->
                <td class="px-4 py-3">
                  <div class="flex flex-col">
                    <span class="font-semibold text-gray-800 whitespace-nowrap">{{ order.customer }}</span>
                    <span v-if="order.phone" class="text-[10px] text-gray-400">{{ order.phone }}</span>
                  </div>
                </td>
                
                <!-- Produk Summary -->
                <td class="px-4 py-3">
                  <div class="flex flex-col max-w-[200px]">
                    <span class="text-gray-700 truncate font-medium">
                      {{ order.items?.[0]?.productName || 'No items' }}
                    </span>
                    <span v-if="(order.items?.length ?? 0) > 1" class="text-[10px] text-blue-500 font-bold uppercase tracking-tight">
                      +{{ order.items!.length - 1 }} Item Lainnya
                    </span>
                  </div>
                </td>
                
                <!-- Total -->
                <td class="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
                  {{ formatCurrency(order.total * 1.11) }}
                </td>
                
                <!-- Status -->
                <td class="px-4 py-3 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border"
                    :class="STATUS_CONFIG[order.status].color"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="STATUS_CONFIG[order.status].icon" />
                    </svg>
                    {{ STATUS_CONFIG[order.status].label }}
                  </span>
                </td>
                
                <!-- Tanggal -->
                <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {{ order.date }}
                </td>
                
                <!-- Aksi (Sticky) -->
                <td class="px-4 py-3 sticky right-0 bg-white group-hover:bg-blue-50/30">
                  <div class="flex items-center gap-2 justify-end">
                    <button 
                      @click="printOrder = order" 
                      class="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <select
                      :value="order.status"
                      @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value as OrderStatus)"
                      class="text-[10px] font-bold border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 cursor-pointer"
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
                  class="bg-blue-50/20 border-b border-blue-100/50"
                >
                  <td class="px-2 py-2"></td>
                  <td class="px-4 py-2 text-[10px] text-gray-400 text-center">#{{ idx + 1 }}</td>
                  <td class="px-4 py-2 text-xs font-semibold text-gray-600" colspan="2">{{ item.productName }}</td>
                  <td class="px-4 py-2 text-[10px] text-gray-500" colspan="4">
                    <div class="flex items-center gap-2">
                      <span class="bg-white px-2 py-0.5 rounded border border-gray-100">{{ formatCurrency(item.pricePerUnit) }} × {{ item.quantity }} m²</span>
                      <span class="font-bold text-gray-700">= {{ formatCurrency(item.total) }}</span>
                    </div>
                  </td>
                </tr>
              </template>
            </template>

            <!-- Empty State -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="px-6 py-16 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p class="text-gray-400 font-medium">Tidak ada pesanan ditemukan</p>
                <p class="text-gray-300 text-sm mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              </td>
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
            <button @click="printOrder = null" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm font-semibold transition-colors">Tutup</button>
            <button onclick="window.print()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Nota
            </button>
          </div>
        </div>
      </div>
    </Teleport>
</template>
