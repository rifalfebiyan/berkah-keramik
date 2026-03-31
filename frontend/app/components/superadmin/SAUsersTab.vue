<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Crown, Shield, UserX, UserCheck } from 'lucide-vue-next'
import { useSuperAdminStore } from '@/composables/useSuperAdminStore'

const store = useSuperAdminStore()

const userSearch = ref('')

const filteredUsers = computed(() =>
  store.adminUsers.value.filter(u =>
    u.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.value.toLowerCase())
  )
)

const tableHeaders = ['User', 'Email', 'Tenant', 'Role', 'Status', 'Terakhir Login', 'Dibuat', 'Aksi']
</script>

<template>
  <div class="space-y-4">
    <!-- Search -->
    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="15" />
      <input
        v-model="userSearch"
        placeholder="Cari user atau email..."
        class="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-gray-400 shadow-sm"
      />
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
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
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <!-- Name + Avatar -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm',
                      user.role === 'superadmin'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500',
                    ]"
                  >
                    {{ user.name.charAt(0) }}
                  </div>
                  <p class="text-sm text-gray-800">{{ user.name }}</p>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-gray-500">{{ user.email }}</td>
              <td class="py-3 px-4 text-sm text-gray-500">{{ user.tenantName }}</td>

              <!-- Role badge -->
              <td class="py-3 px-4">
                <span
                  :class="[
                    'text-xs px-2 py-1 rounded-full border flex items-center gap-1 w-fit',
                    user.role === 'superadmin'
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200',
                  ]"
                >
                  <Crown v-if="user.role === 'superadmin'" :size="10" />
                  <Shield v-else :size="10" />
                  {{ user.role === 'superadmin' ? 'Super Admin' : 'Admin' }}
                </span>
              </td>

              <!-- Status -->
              <td class="py-3 px-4">
                <span
                  :class="[
                    'text-xs px-2 py-1 rounded-full',
                    user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                  ]"
                >
                  {{ user.status === 'active' ? 'Aktif' : 'Suspended' }}
                </span>
              </td>

              <td class="py-3 px-4 text-xs text-gray-400">{{ user.lastLogin }}</td>
              <td class="py-3 px-4 text-xs text-gray-400">{{ user.createdAt }}</td>

              <!-- Action -->
              <td class="py-3 px-4">
                <button
                  v-if="user.role !== 'superadmin'"
                  @click="store.toggleUserStatus(user.id)"
                  :class="[
                    'text-xs px-3 py-1 rounded-lg border transition flex items-center gap-1',
                    user.status === 'active'
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
                  ]"
                >
                  <UserX v-if="user.status === 'active'" :size="11" />
                  <UserCheck v-else :size="11" />
                  {{ user.status === 'active' ? 'Suspend' : 'Aktifkan' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
