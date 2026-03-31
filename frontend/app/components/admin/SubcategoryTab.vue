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

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentSubcategory = ref<Partial<Subcategory>>({
  name: '',
  imageUrl: '',
  categoryId: 0
})

// Image upload state
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const fetchSubcategories = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await $fetch<Subcategory[]>(`${apiUrl}/subcategories`)
    subcategories.value = data
  } catch (err) {
    console.error('Failed to fetch subcategories:', err)
    error.value = 'Gagal memuat subkategori.'
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const data = await $fetch<Category[]>(`${apiUrl}/categories`)
    categories.value = data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

// 🖼️ Handle file selection
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validTypes.includes(file.type)) {
    alert('Hanya file JPG/PNG yang diperbolehkan!')
    input.value = ''
    return
  }
  
  // Validasi ukuran (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file maksimal 5MB!')
    input.value = ''
    return
  }
  
  selectedFile.value = file
  
  // Buat preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
    currentSubcategory.value.imageUrl = imagePreview.value
  }
  reader.readAsDataURL(file)
}

// 🗑️ Clear selected image
const clearImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  currentSubcategory.value.imageUrl = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 📤 Upload file ke server (opsional - jika ingin menyimpan file di server)
const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await $fetch<{ url: string }>(`${apiUrl}/upload`, {
    method: 'POST',
    body: formData
  })
  
  return response.url
}

const openAddModal = () => {
  isEditing.value = false
  currentSubcategory.value = { 
    name: '', 
    imageUrl: '', 
    categoryId: categories.value[0]?.id || 0 
  }
  clearImage()
  isModalOpen.value = true
}

const openEditModal = (sub: Subcategory) => {
  isEditing.value = true
  currentSubcategory.value = { ...sub }
  imagePreview.value = sub.imageUrl
  selectedFile.value = null
  isModalOpen.value = true
}

const saveSubcategory = async () => {
  if (!currentSubcategory.value.name || !currentSubcategory.value.categoryId) return

  try {
    let imageUrl = currentSubcategory.value.imageUrl

    // Jika ada file baru yang diupload, upload ke server dulu
    if (selectedFile.value) {
      isUploading.value = true
      try {
        imageUrl = await uploadImageToServer(selectedFile.value)
      } finally {
        isUploading.value = false
      }
    }

    const payload = {
      name: currentSubcategory.value.name,
      imageUrl: imageUrl,
      categoryId: Number(currentSubcategory.value.categoryId)
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
    clearImage()
    await fetchSubcategories()
  } catch (err) {
    console.error('Failed to save subcategory:', err)
    alert('Gagal menyimpan subkategori.')
  }
}

const deleteSubcategory = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus subkategori ini?')) return

  try {
    await $fetch(`${apiUrl}/subcategories/${id}`, {
      method: 'DELETE'
    })
    await fetchSubcategories()
  } catch (err) {
    console.error('Failed to delete subcategory:', err)
    alert('Gagal menghapus subkategori.')
  }
}

// Close modal & cleanup
const closeModal = () => {
  isModalOpen.value = false
  clearImage()
}

onMounted(async () => {
  await Promise.all([fetchSubcategories(), fetchCategories()])
})
</script>

<template>
  <div class="subcategory-management">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Manajemen Subkategori</h2>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        + Tambah Subkategori
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex justify-between items-center">
      <span>{{ error }}</span>
      <button @click="fetchSubcategories" class="underline font-semibold">Coba Lagi</button>
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
            <th class="px-6 py-4 font-semibold">Nama</th>
            <th class="px-6 py-4 font-semibold">Kategori Induk</th>
            <th class="px-6 py-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(sub, index) in subcategories" :key="sub.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-gray-500 font-medium">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img v-if="sub.imageUrl" :src="sub.imageUrl" class="w-full h-full object-cover">
                <span v-else class="text-xs text-gray-400 font-bold">BK</span>
              </div>
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800">{{ sub.name }}</td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                {{ sub.category?.name || 'Tanpa Kategori' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button 
                  @click="openEditModal(sub)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteSubcategory(sub.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="subcategories.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">
              Belum ada subkategori. Klik "Tambah Subkategori" untuk membuat.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Subkategori' : 'Tambah Subkategori Baru' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Nama Subkategori -->
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600">Nama Subkategori</label>
            <input 
              v-model="currentSubcategory.name" 
              type="text" 
              placeholder="Masukkan nama subkategori..."
              class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
          </div>
          
          <!-- Kategori Induk -->
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600">Kategori Induk</label>
            <select 
              v-model="currentSubcategory.categoryId"
              class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <!-- 🖼️ Upload Gambar -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600">Gambar (JPG/PNG, maks 5MB)</label>
            
            <!-- Preview Image -->
            <div v-if="imagePreview" class="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
              <img :src="imagePreview" class="w-full h-full object-cover">
              <button 
                @click="clearImage"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
                title="Hapus gambar"
              >
                &times;
              </button>
            </div>
            
            <!-- Upload Area -->
            <div 
              v-else
              @click="fileInputRef?.click()"
              class="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <input 
                ref="fileInputRef"
                type="file" 
                accept=".jpg,.jpeg,.png" 
                @change="handleFileChange"
                class="hidden"
              >
              <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</span>
              <span class="text-sm text-gray-500 group-hover:text-blue-600">Klik untuk upload</span>
              <span class="text-xs text-gray-400 mt-1">JPG, PNG • maks 5MB</span>
            </div>
            
            <!-- Loading Upload -->
            <div v-if="isUploading" class="text-sm text-blue-600 flex items-center gap-2">
              <div class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Mengupload gambar...
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button 
            @click="saveSubcategory"
            :disabled="isUploading"
            class="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditing ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subcategory-management {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom file input styling */
input[type="file"]::-webkit-file-upload-button {
  display: none;
}
</style>