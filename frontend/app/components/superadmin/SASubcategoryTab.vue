<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

interface Category {
  id: number
  name: string
  imageUrl: string | null
}

interface Subcategory {
  id: number
  name: string
  imageUrl: string | null
  categoryId: number
  category: Category
}

const subcategories = ref<Subcategory[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentSubcategory = ref<Partial<Subcategory>>({ name: '', imageUrl: '', categoryId: 0 })

const fetchSubcategories = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<Subcategory[]>(`${apiUrl}/subcategories`)
    subcategories.value = data
  } catch (err) {
    error.value = 'Gagal memuat subkategori.'
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const data = await $fetch<Category[]>(`${apiUrl}/categories`)
    categories.value = data
  } catch (err) {}
}

const openAddModal = () => {
  isEditing.value = false
  currentSubcategory.value = { name: '', imageUrl: '', categoryId: categories.value[0]?.id || 0 }
  isModalOpen.value = true
}

const openEditModal = (sub: Subcategory) => {
  isEditing.value = true
  currentSubcategory.value = { ...sub }
  isModalOpen.value = true
}

const saveSubcategory = async () => {
  if (!currentSubcategory.value.name || !currentSubcategory.value.categoryId) return
  try {
    const payload = {
      name: currentSubcategory.value.name,
      imageUrl: currentSubcategory.value.imageUrl,
      category: { connect: { id: currentSubcategory.value.categoryId } }
    }
    if (isEditing.value && currentSubcategory.value.id) {
      await $fetch(`${apiUrl}/subcategories/${currentSubcategory.value.id}`, {
        method: 'PATCH',
        body: payload
      })
    } else {
      await $fetch(`${apiUrl}/subcategories`, {
        method: 'POST',
        body: payload
      })
    }
    isModalOpen.value = false
    await fetchSubcategories()
  } catch (err) {
    alert('Gagal menyimpan.')
  }
}

const deleteSubcategory = async (id: number) => {
  if (!confirm('Hapus subkategori ini?')) return
  try {
    await $fetch(`${apiUrl}/subcategories/${id}`, { method: 'DELETE' })
    await fetchSubcategories()
  } catch (err) {
    alert('Gagal menghapus.')
  }
}

onMounted(async () => {
  await Promise.all([fetchSubcategories(), fetchCategories()])
})
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-900 italic underline decoration-purple-500 underline-offset-8">Master Subkategori</h2>
        <p class="text-gray-400 text-xs mt-2">Hubungkan subproduk dengan kategori induk secara global</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-purple-200"
      >
        + Tambah Subkategori
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-purple-50/50 text-purple-600 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 font-bold">Nomor</th>
            <th class="px-6 py-4 font-bold">Gambar</th>
            <th class="px-6 py-4 font-bold">Nama</th>
            <th class="px-6 py-4 font-bold">Kategori Induk</th>
            <th class="px-6 py-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(sub, index) in subcategories" :key="sub.id" class="hover:bg-purple-50/20 transition-colors group">
            <td class="px-6 py-4 text-gray-400 font-medium text-sm">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img v-if="sub.imageUrl" :src="sub.imageUrl" class="w-full h-full object-cover">
                <span v-else class="text-[10px] text-gray-400 font-bold">BK</span>
              </div>
            </td>
            <td class="px-6 py-4 font-bold text-gray-700">{{ sub.name }}</td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {{ sub.category?.name }}
              </span>
            </td>
            <td class="px-6 py-4 text-right px-6 py-4 font-bold text-gray-700">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(sub)" class="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">✏️</button>
                <button @click="deleteSubcategory(sub.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal omitted for brevity, same structure as Category -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-purple-50/30">
          <h3 class="text-lg font-bold text-purple-900">{{ isEditing ? 'Edit Subkategori' : 'Subkategori Baru' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div class="p-8 space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nama Subkategori</label>
            <input v-model="currentSubcategory.name" type="text" class="w-full px-5 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-300" placeholder="...">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Pilih Kategori Induk</label>
            <select v-model="currentSubcategory.categoryId" class="w-full px-5 py-3 border border-gray-100 rounded-2xl bg-white">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>
        <div class="px-8 py-6 bg-gray-50/50 flex justify-end gap-3">
          <button @click="isModalOpen = false" class="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="saveSubcategory" class="px-8 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
