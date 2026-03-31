<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

interface Category {
  id: number
  name: string
  imageUrl: string | null
}

const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCategory = ref<Partial<Category>>({ name: '', imageUrl: '' })

const fetchCategories = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await $fetch<Category[]>(`${apiUrl}/categories`)
    categories.value = data
  } catch (err) {
    error.value = 'Gagal memuat kategori.'
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  currentCategory.value = { name: '', imageUrl: '' }
  isModalOpen.value = true
}

const openEditModal = (cat: Category) => {
  isEditing.value = true
  currentCategory.value = { ...cat }
  isModalOpen.value = true
}

const saveCategory = async () => {
  if (!currentCategory.value.name) return
  try {
    if (isEditing.value && currentCategory.value.id) {
      await $fetch(`${apiUrl}/categories/${currentCategory.value.id}`, {
        method: 'PATCH',
        body: currentCategory.value
      })
    } else {
      await $fetch(`${apiUrl}/categories`, {
        method: 'POST',
        body: currentCategory.value
      })
    }
    isModalOpen.value = false
    await fetchCategories()
  } catch (err) {
    alert('Gagal menyimpan kategori.')
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Hapus kategori ini?')) return
  try {
    await $fetch(`${apiUrl}/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
  } catch (err) {
    alert('Gagal menghapus kategori.')
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-900 italic underline decoration-violet-500 underline-offset-8">Master Kategori</h2>
        <p class="text-gray-400 text-xs mt-2">Kelola kategori utama produk secara global</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 flex items-center gap-2"
      >
        <span>+</span> Tambah Kategori
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-violet-50/50 text-violet-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 font-bold">Nomor</th>
            <th class="px-6 py-4 font-bold">Gambar</th>
            <th class="px-6 py-4 font-bold">Nama Kategori</th>
            <th class="px-6 py-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(cat, index) in categories" :key="cat.id" class="hover:bg-violet-50/20 transition-colors group">
            <td class="px-6 py-4 text-gray-400 font-medium text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 group-hover:border-violet-200 transition-all flex items-center justify-center">
                <img v-if="cat.imageUrl" :src="cat.imageUrl" class="w-full h-full object-cover">
                <span v-else class="text-[10px] text-gray-400 font-bold">BK</span>
              </div>
            </td>
            <td class="px-6 py-4 font-bold text-gray-700">{{ cat.name }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(cat)" class="p-2 text-violet-600 hover:bg-violet-100 rounded-lg">✏️</button>
                <button @click="deleteCategory(cat.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="categories.length === 0 && !isLoading">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400 text-sm italic">Belum ada data kategori.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
        <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-violet-50/30">
          <h3 class="text-lg font-bold text-violet-900">{{ isEditing ? 'Edit Kategori' : 'Kategori Baru' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div class="p-8 space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nama Kategori</label>
            <input v-model="currentCategory.name" type="text" class="w-full px-5 py-3 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-300 focus:outline-none transition-all" placeholder="Misal: Keramik Lantai">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">URL Gambar</label>
            <input v-model="currentCategory.imageUrl" type="text" class="w-full px-5 py-3 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-300 focus:outline-none transition-all" placeholder="https://...">
          </div>
        </div>
        <div class="px-8 py-6 bg-gray-50/50 flex justify-end gap-3">
          <button @click="isModalOpen = false" class="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Batal</button>
          <button @click="saveCategory" class="px-8 py-2.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
            {{ isEditing ? 'Simpan' : 'Buat' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
