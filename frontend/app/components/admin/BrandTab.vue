<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

interface Brand {
  id: number
  name: string
  logoUrl: string | null
}

const brands = ref<Brand[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const brandToDelete = ref<number | null>(null)
const currentBrand = ref<Partial<Brand>>({
  name: '',
  logoUrl: ''
})

// Image upload state
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const token = useCookie('token')

const fetchBrands = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await $fetch<Brand[]>(`${apiUrl}/brands`)
    brands.value = data
  } catch (err) {
    console.error('Failed to fetch brands:', err)
    error.value = 'Gagal memuat brands.'
  } finally {
    isLoading.value = false
  }
}

// 🖼️ Handle file selection
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validasi tipe file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Hanya file JPG/PNG/WebP yang diperbolehkan!')
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
    currentBrand.value.logoUrl = imagePreview.value
  }
  reader.readAsDataURL(file)
}

// 🗑️ Clear selected image
const clearImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  currentBrand.value.logoUrl = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 📤 Upload file ke server
const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await $fetch<{ url: string }>(`${apiUrl}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  
  return response.url
}

const openAddModal = () => {
  isEditing.value = false
  currentBrand.value = { name: '', logoUrl: '' }
  clearImage()
  isModalOpen.value = true
}

const openEditModal = (brand: Brand) => {
  isEditing.value = true
  currentBrand.value = { ...brand }
  imagePreview.value = brand.logoUrl
  selectedFile.value = null
  isModalOpen.value = true
}

const saveBrand = async () => {
  if (!currentBrand.value.name) return

  try {
    let imageUrl = currentBrand.value.logoUrl

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
      name: currentBrand.value.name,
      logoUrl: imageUrl
    }

    if (isEditing.value && currentBrand.value.id) {
      await $fetch(`${apiUrl}/brands/${currentBrand.value.id}`, {
        method: 'PATCH',
        body: payload,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } else {
      await $fetch(`${apiUrl}/brands`, {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    }
    isModalOpen.value = false
    clearImage()
    await fetchBrands()
  } catch (err: any) {
    console.error('Failed to save brand:', err)
    const errorMessage = err.response?._data?.message || err.message || 'Gagal menyimpan brand.'
    alert(`Error: ${errorMessage}`)
  }
}

const openDeleteConfirm = (id: number) => {
  brandToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!brandToDelete.value) return
  
  isDeleting.value = true
  try {
    await $fetch(`${apiUrl}/brands/${brandToDelete.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    showDeleteConfirm.value = false
    brandToDelete.value = null
    await fetchBrands()
  } catch (err) {
    console.error('Failed to delete brand:', err)
    alert('Gagal menghapus brand.')
  } finally {
    isDeleting.value = false
  }
}

// Close modal & cleanup
const closeModal = () => {
  isModalOpen.value = false
  clearImage()
}

onMounted(() => {
  fetchBrands()
})
</script>

<template>
  <div class="brand-management">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Brand</h2>
        <p class="text-sm text-gray-400 mt-1">{{ brands.length }} brand ditemukan</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Brand
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex justify-between items-center">
      <span>{{ error }}</span>
      <button @click="fetchBrands" class="underline font-semibold">Coba Lagi</button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat data...
      </div>

      <!-- Scrollable Table Wrapper -->
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 font-semibold w-14">#</th>
              <th class="px-4 py-3 font-semibold w-16">Gambar</th>
              <th class="px-4 py-3 font-semibold">Nama Brand</th>
              <th class="px-4 py-3 font-semibold text-right whitespace-nowrap sticky right-0 bg-gray-50">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="(brand, index) in brands" :key="brand.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-4 py-3 text-gray-400 font-medium text-xs">{{ index + 1 }}</td>
              <td class="px-4 py-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img v-if="brand.logoUrl" :src="brand.logoUrl" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{{ brand.name }}</td>
              <td class="px-4 py-3 sticky right-0 bg-white">
                <div class="flex gap-1 justify-end">
                  <button 
                    @click="openEditModal(brand)"
                    class="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="openDeleteConfirm(brand.id)"
                    class="text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="brands.length === 0">
              <td colspan="4" class="px-6 py-16 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-gray-400 font-medium">Belum ada brand</p>
                <p class="text-gray-300 text-sm mt-1">Klik "Tambah Brand" untuk membuat.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Brand' : 'Tambah Brand Baru' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Nama Brand -->
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600">Nama Brand</label>
            <input 
              v-model="currentBrand.name" 
              type="text" 
              placeholder="Masukkan nama brand..."
              class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
          </div>
          
          <!-- 🖼️ Upload Gambar -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-600">Logo Brand (JPG/PNG/WebP, maks 5MB)</label>
            
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
                accept=".jpg,.jpeg,.png,.webp" 
                @change="handleFileChange"
                class="hidden"
              >
              <svg class="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-500 group-hover:text-blue-600">Klik untuk upload logo</span>
              <span class="text-xs text-gray-400 mt-1">JPG, PNG, WebP • maks 5MB</span>
            </div>
            
            <!-- Loading Upload -->
            <div v-if="isUploading" class="text-sm text-blue-600 flex items-center gap-2">
              <div class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Mengupload logo...
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
            @click="saveBrand"
            :disabled="isUploading"
            class="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditing ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      :show="showDeleteConfirm"
      title="Hapus Brand?"
      message="Tindakan ini tidak dapat dibatalkan. Semua produk di bawah brand ini juga akan ikut terhapus."
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      type="danger"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<style scoped>
.brand-management {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
