<script setup lang="ts">
import { computed } from 'vue'
import {
  DollarSign, Building2, ShoppingBag, Package,
  ArrowUpRight, ArrowDownRight, Star, PieChart, Activity,
} from 'lucide-vue-next'
import { useSuperAdminStore, formatCurrency, PLAN_CONFIG, LOG_TYPE } from '@/composables/useSuperAdminStore'

const emit = defineEmits<{
  (e: 'navigate', tab: 'tenants' | 'logs'): void
}>()

const store = useSuperAdminStore()

const statCards = computed(() => [
  {
    label: 'Total Pendapatan Platform',
    value: formatCurrency(store.totalRevenue.value),
    color: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-200',
    sub: '+18.2% vs bulan lalu',
    up: true,
  },
  {
    label: 'Tenant Aktif',
    value: `${store.activeTenants.value} / ${store.tenants.value.length}`,
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-200',
    sub: `${store.trialCount.value} dalam masa trial`,
    up: true,
  },
  {
    label: 'Total Pesanan',
    value: store.totalOrders.value.toLocaleString(),
    color: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-200',
    sub: 'Dari semua tenant',
    up: true,
  },
  {
    label: 'Total Produk',
    value: store.totalProducts.value.toLocaleString(),
    color: 'from-orange-400 to-amber-500',
    shadow: 'shadow-orange-200',
    sub: 'Katalog gabungan',
    up: false,
  },
])

const topTenants = computed(() =>
  [...store.tenants.value].sort((a, b) => b.revenue - a.revenue).slice(0, 4)
)

const planOrders = ['enterprise', 'business', 'starter'] as const

const planBarColor: Record<string, string> = {
  enterprise: 'bg-violet-500',
  business:   'bg-blue-500',
  starter:    'bg-gray-400',
}

const systemStatus = [
  { label: 'Database',   val: '98.5%', ok: true },
  { label: 'API Server', val: '100%',  ok: true },
  { label: 'CDN',        val: '99.9%', ok: true },
  { label: 'Backup',     val: 'OK',    ok: true },
]

const medalColor = (i: number) => {
  if (i === 0) return 'bg-amber-400 text-white'
  if (i === 1) return 'bg-gray-300 text-gray-700'
  return 'bg-amber-700 text-white'
}
</script>

<template>
  <div class="space-y-6">

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(s, i) in statCards"
        :key="i"
        class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
      >
        <div class="flex items-center justify-between mb-4">
          <div :class="`w-11 h-11 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white shadow-md ${s.shadow}`">
            <DollarSign v-if="i === 0" :size="20" />
            <Building2  v-if="i === 1" :size="20" />
            <ShoppingBag v-if="i === 2" :size="20" />
            <Package    v-if="i === 3" :size="20" />
          </div>
          <span v-if="s.up" class="text-xs text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-1 rounded-full">
            <ArrowUpRight :size="12" />+18%
          </span>
          <span v-else class="text-xs text-red-500 flex items-center gap-0.5 bg-red-50 px-2 py-1 rounded-full">
            <ArrowDownRight :size="12" />-3%
          </span>
        </div>
        <p class="text-2xl text-gray-900">{{ s.value }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ s.label }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ s.sub }}</p>
      </div>
    </div>

    <!-- Top Tenants + Plan Distribution -->
    <div class="grid lg:grid-cols-3 gap-6">

      <!-- Top Tenants -->
      <div class="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-gray-800 flex items-center gap-2">
            <Star :size="16" class="text-amber-400" />
            Top Tenant by Revenue
          </h2>
          <button
            @click="emit('navigate', 'tenants')"
            class="text-xs text-violet-600 hover:text-violet-700 font-medium"
          >
            Lihat semua →
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(t, i) in topTenants"
            :key="t.id"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
          >
            <span :class="`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${medalColor(i)}`">
              {{ i + 1 }}
            </span>
            <div class="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
              {{ t.storeLogo }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 truncate">{{ t.name }}</p>
              <p class="text-xs text-gray-400">{{ t.orders }} pesanan</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-emerald-600">{{ formatCurrency(t.revenue) }}</p>
              <span :class="`text-xs px-2 py-0.5 rounded-full border ${PLAN_CONFIG[t.plan].color}`">
                {{ PLAN_CONFIG[t.plan].label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan Distribution + System Status -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 class="text-gray-800 flex items-center gap-2 mb-5">
          <PieChart :size="16" class="text-violet-500" />
          Distribusi Plan
        </h2>
        <div class="space-y-4">
          <div v-for="plan in planOrders" :key="plan">
            <div class="flex items-center justify-between mb-1.5">
              <span :class="`text-xs px-2 py-0.5 rounded-full border ${PLAN_CONFIG[plan].color}`">
                {{ PLAN_CONFIG[plan].label }}
              </span>
              <span class="text-xs text-gray-400">
                {{ store.tenants.value.filter(t => t.plan === plan).length }} tenant
                ({{ Math.round((store.tenants.value.filter(t => t.plan === plan).length / store.tenants.value.length) * 100) }}%)
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                :class="`h-full rounded-full transition-all ${planBarColor[plan]}`"
                :style="{ width: `${Math.round((store.tenants.value.filter(t => t.plan === plan).length / store.tenants.value.length) * 100)}%` }"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 pt-5 border-t border-gray-100 space-y-3">
          <h3 class="text-xs text-gray-400 uppercase tracking-wider">Status Sistem</h3>
          <div
            v-for="item in systemStatus"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <span class="text-xs text-gray-500">{{ item.label }}</span>
            <span :class="`text-xs flex items-center gap-1.5 ${item.ok ? 'text-emerald-600' : 'text-red-500'}`">
              <span :class="`w-1.5 h-1.5 rounded-full animate-pulse ${item.ok ? 'bg-emerald-500' : 'bg-red-500'}`" />
              {{ item.val }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Logs -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-gray-800 flex items-center gap-2">
          <Activity :size="16" class="text-violet-500" />
          Log Aktivitas Terbaru
        </h2>
        <button
          @click="emit('navigate', 'logs')"
          class="text-xs text-violet-600 hover:text-violet-700 font-medium"
        >
          Lihat semua →
        </button>
      </div>
      <div class="space-y-1">
        <div
          v-for="log in store.logs.value.slice(0, 4)"
          :key="log.id"
          class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
        >
          <span :class="`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${LOG_TYPE[log.type].dot}`" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-700">{{ log.action }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ log.user }} · {{ log.tenant }}</p>
          </div>
          <span class="text-xs text-gray-400 flex-shrink-0">{{ log.timestamp }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
