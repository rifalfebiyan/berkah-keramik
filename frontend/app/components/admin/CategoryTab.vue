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

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCategory = ref<Partial<Category>>({
  name: '',
  imageUrl: ''
})

const fetchCategories = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await $fetch<Category[]>(`${apiUrl}/categories`)
    categories.value = data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
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
        body: {
          name: currentCategory.value.name,
          imageUrl: currentCategory.value.imageUrl
        }
      })
    } else {
      await $fetch(`${apiUrl}/categories`, {
        method: 'POST',
        body: {
          name: currentCategory.value.name,
          imageUrl: currentCategory.value.imageUrl
        }
      })
    }
    isModalOpen.value = false
    await fetchCategories()
  } catch (err) {
    console.error('Failed to save category:', err)
    alert('Gagal menyimpan kategori.')
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return

  try {
    await $fetch(`${apiUrl}/categories/${id}`, {
      method: 'DELETE'
    })
    await fetchCategories()
  } catch (err) {
    console.error('Failed to delete category:', err)
    alert('Gagal menghapus kategori.')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="category-management">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        + Tambah Kategori
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex justify-between items-center">
      <span>{{ error }}</span>
      <button @click="fetchCategories" class="underline font-semibold">Coba Lagi</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat data...
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-500 text-sm uppercase">
          <tr>
            <th class="px-6 py-4 font-semibold">Nomor</th>
            <th class="px-6 py-4 font-semibold">Gambar</th>
            <th class="px-6 py-4 font-semibold">Nama Kategori</th>
            <th class="px-6 py-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(cat, index) in categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-gray-500 font-medium">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img v-if="cat.imageUrl" :src="cat.imageUrl" class="w-full h-full object-cover">
                <span v-else class="text-xs text-gray-400 font-bold">BK</span>
              </div>
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800 text-lg">{{ cat.name }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button 
                  @click="openEditModal(cat)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteCategory(cat.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-400 italic">
              Belum ada kategori. Klik "Tambah Kategori" untuk membuat.
            </td>
          </tr>
        </tbody>
      </table>

      
    </div>

    <!-- Simple Modal Overlay -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600">Nama Kategori</label>
            <input 
              v-model="currentCategory.name" 
              type="text" 
              placeholder="Masukkan nama kategori..."
              class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600">URL Gambar (Opsional)</label>
            <input 
              v-model="currentCategory.imageUrl" 
              type="text" 
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            @click="isModalOpen = false"
            class="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button 
            @click="saveCategory"
            class="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            {{ isEditing ? 'Update Kategori' : 'Simpan Kategori' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-management {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
