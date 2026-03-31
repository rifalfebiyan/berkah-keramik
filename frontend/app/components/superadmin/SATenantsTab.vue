<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search, Plus, Pencil, Trash2, UserX, UserCheck,
  ChevronDown, ChevronUp, Check, X,
} from 'lucide-vue-next'
import {
  useSuperAdminStore, formatCurrency, PLAN_CONFIG, TENANT_STATUS,
  type Tenant, type TenantForm,
} from '@/composables/useSuperAdminStore'

const store = useSuperAdminStore()

const tenantSearch   = ref('')
const expandedId     = ref<number | null>(null)
const showModal      = ref(false)
const editingId      = ref<number | null>(null)
const form           = ref<TenantForm>({ name: '', owner: '', email: '', phone: '', plan: 'starter' })

const filteredTenants = computed(() =>
  store.tenants.value.filter(t =>
    t.name.toLowerCase().includes(tenantSearch.value.toLowerCase()) ||
    t.owner.toLowerCase().includes(tenantSearch.value.toLowerCase())
  )
)

function openAdd() {
  editingId.value = null
  form.value = { name: '', owner: '', email: '', phone: '', plan: 'starter' }
  showModal.value = true
}

function openEdit(t: Tenant) {
  editingId.value = t.id
  form.value = { name: t.name, owner: t.owner, email: t.email, phone: t.phone, plan: t.plan }
  showModal.value = true
}

function save() {
  store.saveTenant(form.value, editingId.value)
  showModal.value = false
}

function deleteTenant(id: number) {
  if (confirm('Hapus tenant ini? Semua data akan hilang permanen.')) {
    store.deleteTenant(id)
  }
}

const tableHeaders = ['', 'Tenant', 'Plan', 'Status', 'Revenue', 'Pesanan', 'Produk', 'Admin', 'Bergabung', 'Aksi']

const planOptions: Tenant['plan'][] = ['starter', 'business', 'enterprise']
</script>

<template>
  <div class="space-y-4">

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-3 justify-between">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="15" />
        <input
          v-model="tenantSearch"
          placeholder="Cari tenant atau pemilik..."
          class="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-gray-400 shadow-sm"
        />
      </div>
      <button
        @click="openAdd"
        class="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm shadow-sm"
      >
        <Plus :size="15" /> Tambah Tenant
      </button>
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
            <template v-for="tenant in filteredTenants" :key="tenant.id">
              <!-- Main row -->
              <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-2">
                  <button
                    @click="expandedId = expandedId === tenant.id ? null : tenant.id"
                    class="p-1 text-gray-400 hover:text-gray-600 transition"
                  >
                    <ChevronUp v-if="expandedId === tenant.id" :size="14" />
                    <ChevronDown v-else :size="14" />
                  </button>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm">
                      {{ tenant.storeLogo }}
                    </div>
                    <div>
                      <p class="text-sm text-gray-800">{{ tenant.name }}</p>
                      <p class="text-xs text-gray-400">{{ tenant.owner }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span :class="`text-xs px-2 py-1 rounded-full border ${PLAN_CONFIG[tenant.plan].color}`">
                    {{ PLAN_CONFIG[tenant.plan].label }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span :class="`text-xs px-2 py-1 rounded-full ${TENANT_STATUS[tenant.status].color}`">
                    {{ TENANT_STATUS[tenant.status].label }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-emerald-600">{{ formatCurrency(tenant.revenue) }}</td>
                <td class="py-3 px-4 text-sm text-gray-700">{{ tenant.orders }}</td>
                <td class="py-3 px-4 text-sm text-gray-700">{{ tenant.products }}</td>
                <td class="py-3 px-4 text-sm text-gray-700">{{ tenant.admins }}</td>
                <td class="py-3 px-4 text-xs text-gray-400">{{ tenant.joinDate }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center gap-1">
                    <button
                      @click="openEdit(tenant)"
                      class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil :size="13" />
                    </button>
                    <button
                      @click="store.toggleTenantStatus(tenant.id)"
                      :class="`p-1.5 rounded-lg transition ${tenant.status === 'active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`"
                      :title="tenant.status === 'active' ? 'Suspend' : 'Aktifkan'"
                    >
                      <UserX v-if="tenant.status === 'active'" :size="13" />
                      <UserCheck v-else :size="13" />
                    </button>
                    <button
                      @click="deleteTenant(tenant.id)"
                      class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expanded row -->
              <tr v-if="expandedId === tenant.id" class="bg-violet-50/50 border-b border-gray-100">
                <td colspan="10" class="px-8 py-4">
                  <div class="grid grid-cols-3 gap-6">
                    <div>
                      <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Kontak</p>
                      <p class="text-sm text-gray-700">{{ tenant.email }}</p>
                      <p class="text-sm text-gray-700">{{ tenant.phone }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Aktivitas</p>
                      <p class="text-sm text-gray-700">Terakhir aktif: {{ tenant.lastActive }}</p>
                      <p class="text-sm text-gray-700">Bergabung: {{ tenant.joinDate }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Upgrade Plan</p>
                      <div class="flex gap-2">
                        <button
                          v-for="p in planOptions"
                          :key="p"
                          @click="store.upgradePlan(tenant.id, p)"
                          :class="[
                            'text-xs px-3 py-1 rounded-full border transition',
                            tenant.plan === p
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'border-gray-300 text-gray-500 hover:border-violet-400 hover:text-violet-600',
                          ]"
                        >
                          {{ PLAN_CONFIG[p].label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      >
        <div class="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-gray-800">{{ editingId ? 'Edit Tenant' : 'Tambah Tenant Baru' }}</h3>
            <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition">
              <X :size="18" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="field in [
              { key: 'name',  label: 'Nama Toko *',    placeholder: 'Nama tenant/toko' },
              { key: 'owner', label: 'Nama Pemilik',    placeholder: 'Nama pemilik' },
              { key: 'email', label: 'Email *',         placeholder: 'email@toko.com' },
              { key: 'phone', label: 'Telepon',         placeholder: '0812-xxxx-xxxx' },
            ]" :key="field.key">
              <label class="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{{ field.label }}</label>
              <input
                v-model="(form as any)[field.key]"
                :placeholder="field.placeholder"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-gray-400"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Plan</label>
              <select
                v-model="form.plan"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm"
              >
                <option value="starter">Starter</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 p-6 border-t border-gray-100">
            <button
              @click="showModal = false"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Batal
            </button>
            <button
              @click="save"
              class="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Check :size="15" />
              {{ editingId ? 'Simpan Perubahan' : 'Tambah Tenant' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
