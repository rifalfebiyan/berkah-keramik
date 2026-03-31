<script setup lang="ts">
import {
  Settings, Globe, AlertTriangle, RefreshCw, LogOut,
  ToggleLeft, ToggleRight,
} from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'

const store = useSuperAdminStore()

const platformInfo = [
  { label: 'Platform Version', value: 'v2.4.1' },
  { label: 'Environment',      value: 'Production' },
  { label: 'Database',         value: 'MySQL 8.0' },
  { label: 'Cache',            value: 'Redis 7.0' },
  { label: 'Last Deploy',      value: '2026-03-01 08:00 WIB' },
  { label: 'Uptime',           value: '99.97% (30 hari)' },
]
</script>

<template>
  <div class="space-y-6 max-w-2xl">

    <!-- System Controls -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-gray-800 mb-5 flex items-center gap-2">
        <Settings :size="16" class="text-violet-500" />
        System Controls
      </h2>
      <div class="space-y-3">

        <!-- Maintenance Mode -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p :class="['text-sm', store.maintenanceMode.value ? 'text-red-600' : 'text-gray-800']">
              Maintenance Mode
            </p>
            <p class="text-xs text-gray-400 mt-0.5">Nonaktifkan akses user selama maintenance</p>
          </div>
          <button
            @click="store.maintenanceMode.value = !store.maintenanceMode.value"
            :class="['transition', store.maintenanceMode.value ? 'text-red-500' : 'text-gray-300']"
          >
            <ToggleRight v-if="store.maintenanceMode.value" :size="32" />
            <ToggleLeft  v-else :size="32" />
          </button>
        </div>

        <!-- Auto Backup -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p class="text-sm text-gray-800">Auto Backup Database</p>
            <p class="text-xs text-gray-400 mt-0.5">Backup otomatis setiap hari pukul 02:00 WIB</p>
          </div>
          <button
            @click="store.autoBackup.value = !store.autoBackup.value"
            :class="['transition', store.autoBackup.value ? 'text-violet-500' : 'text-gray-300']"
          >
            <ToggleRight v-if="store.autoBackup.value" :size="32" />
            <ToggleLeft  v-else :size="32" />
          </button>
        </div>

        <!-- Email Notifikasi -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p class="text-sm text-gray-800">Email Notifikasi</p>
            <p class="text-xs text-gray-400 mt-0.5">Kirim email saat ada aktivitas penting</p>
          </div>
          <button
            @click="store.emailNotif.value = !store.emailNotif.value"
            :class="['transition', store.emailNotif.value ? 'text-violet-500' : 'text-gray-300']"
          >
            <ToggleRight v-if="store.emailNotif.value" :size="32" />
            <ToggleLeft  v-else :size="32" />
          </button>
        </div>

      </div>
    </div>

    <!-- Platform Info -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-gray-800 mb-5 flex items-center gap-2">
        <Globe :size="16" class="text-violet-500" />
        Informasi Platform
      </h2>
      <div class="space-y-0">
        <div
          v-for="item in platformInfo"
          :key="item.label"
          class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <span class="text-sm text-gray-500">{{ item.label }}</span>
          <span class="text-sm text-gray-800">{{ item.value }}</span>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-red-600 mb-4 flex items-center gap-2">
        <AlertTriangle :size="16" />
        Danger Zone
      </h2>
      <div class="space-y-3">
        <button class="w-full px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm text-left flex items-center justify-between">
          <span>Reset Semua Cache</span>
          <RefreshCw :size="14" />
        </button>
        <button class="w-full px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm text-left flex items-center justify-between">
          <span>Force Logout Semua Session</span>
          <LogOut :size="14" />
        </button>
      </div>
    </div>

  </div>
</template>
