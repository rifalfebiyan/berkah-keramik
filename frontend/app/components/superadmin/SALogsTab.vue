<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { useSuperAdminStore, LOG_TYPE } from '@/composables/useSuperAdminStore'

const store = useSuperAdminStore()

const tableHeaders = ['Tipe', 'Aksi', 'User', 'Tenant', 'Waktu']
</script>

<template>
  <div class="space-y-4">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <p class="text-gray-500 text-sm">{{ store.logs.value.length }} log entries</p>
      <button class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm shadow-sm">
        <RefreshCw :size="13" /> Refresh
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="(h, i) in tableHeaders"
              :key="i"
              class="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider"
            >
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="log in store.logs.value"
            :key="log.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="py-3 px-4">
              <div :class="`w-2.5 h-2.5 rounded-full ${LOG_TYPE[log.type].dot}`" />
            </td>
            <td class="py-3 px-4 text-sm text-gray-700 max-w-xs">{{ log.action }}</td>
            <td class="py-3 px-4 text-xs text-gray-500">{{ log.user }}</td>
            <td class="py-3 px-4 text-xs text-gray-500">{{ log.tenant }}</td>
            <td class="py-3 px-4 text-xs text-gray-400">{{ log.timestamp }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
