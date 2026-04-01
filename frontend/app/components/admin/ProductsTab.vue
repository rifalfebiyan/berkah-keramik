<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  oldPrice: number
  discount: string
  stock: number
  sold: number
  rating: number
  size: string | null
  color: string | null
  imageUrl: string | null
  brand: Brand
  brandId: number
  category: Category
  categoryId: number
  subcategory: Subcategory | null
  subcategoryId: number | null
  isFlashSale: boolean
  flashSaleEndsAt: string | null
  createdAt: string
  updatedAt: string
}

interface Brand {
  id: number
  name: string
  logoUrl: string | null
}

interface Category {
  id: number
  name: string
  imageUrl: string | null
}

interface Subcategory {
  id: number
  name: string
  categoryId: number
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const subcategories = ref<Subcategory[]>([])
const brands = ref<Brand[]>([])
const isLoading = ref(false)
const isUploading = ref(false)
const error = ref<string | null>(null)
const filterSize = ref('')
const filterColor = ref('')
const token = useCookie('token')
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const productToDelete = ref<number | null>(null)

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchSize = !filterSize.value || (p.size?.toLowerCase().includes(filterSize.value.toLowerCase()))
    const matchColor = !filterColor.value || (p.color?.toLowerCase().includes(filterColor.value.toLowerCase()))
    return matchSize && matchColor
  })
})

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentProduct = ref<Partial<Product>>({
  name: '',
  description: '',
  price: 0,
  oldPrice: 0,
  discount: '',
  stock: 0,
  sold: 0,
  rating: 0,
  size: '',
  color: '',
  imageUrl: '',
  brandId: 0,
  categoryId: 0,
  subcategoryId: null,
  isFlashSale: false,
  flashSaleEndsAt: null
})

// Auto-calculate price based on oldPrice and discount
watch([() => currentProduct.value.oldPrice, () => currentProduct.value.discount], ([newOldPrice, newDiscount]) => {
  if (newOldPrice && newDiscount) {
    const discountVal = parseFloat(String(newDiscount).replace('%', ''))
    if (!isNaN(discountVal)) {
      const calculatedPrice = newOldPrice - (newOldPrice * (discountVal / 100))
      currentProduct.value.price = Math.round(calculatedPrice)
    }
  }
})

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await $fetch<Product[]>(`${apiUrl}/products`)
    products.value = data
  } catch (err) {
    console.error('Failed to fetch products:', err)
    error.value = 'Gagal memuat produk.'
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

const fetchSubcategories = async () => {
  try {
    const data = await $fetch<Subcategory[]>(`${apiUrl}/subcategories`)
    subcategories.value = data
  } catch (err) {
    console.error('Failed to fetch subcategories:', err)
  }
}

const fetchBrands = async () => {
  try {
    const data = await $fetch<Brand[]>(`${apiUrl}/brands`)
    brands.value = data
  } catch (err) {
    console.error('Failed to fetch brands:', err)
  }
}

const openAddModal = () => {
  isEditing.value = false
  currentProduct.value = { 
    name: '', description: '', price: 0, oldPrice: 0, discount: '', 
    stock: 0, sold: 0, rating: 0, size: '', color: '', imageUrl: '', 
    brandId: brands.value[0]?.id || 0, categoryId: categories.value[0]?.id || 0, subcategoryId: null,
    isFlashSale: false, flashSaleEndsAt: null
  }
  isModalOpen.value = true
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', 'products')

  try {
    const data = await $fetch<{ url: string }>(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    currentProduct.value.imageUrl = data.url
  } catch (err) {
    console.error('Failed to upload image:', err)
    alert('Gagal mengunggah gambar.')
  } finally {
    isUploading.value = false
  }
}

const openEditModal = (prod: Product) => {
  isEditing.value = true
  currentProduct.value = { ...prod }
  isModalOpen.value = true
}

const saveProduct = async () => {
  if (!currentProduct.value.name) return
  if (!currentProduct.value.brandId || !currentProduct.value.categoryId) {
    alert('Pilih Brand dan Kategori terlebih dahulu.')
    return
  }

  try {
    const body = {
      name: currentProduct.value.name,
      description: currentProduct.value.description,
      price: currentProduct.value.price,
      oldPrice: currentProduct.value.oldPrice || null,
      discount: currentProduct.value.discount || null,
      stock: currentProduct.value.stock,
      sold: currentProduct.value.sold || 0,
      rating: currentProduct.value.rating || 0,
      size: currentProduct.value.size || null,
      color: currentProduct.value.color || null,
      imageUrl: currentProduct.value.imageUrl,
      brand: { connect: { id: currentProduct.value.brandId } },
      category: { connect: { id: currentProduct.value.categoryId } },
      subcategory: currentProduct.value.subcategoryId 
        ? { connect: { id: currentProduct.value.subcategoryId } } 
        : undefined,
      isFlashSale: currentProduct.value.isFlashSale,
      flashSaleEndsAt: currentProduct.value.isFlashSale && currentProduct.value.flashSaleEndsAt 
        ? new Date(currentProduct.value.flashSaleEndsAt).toISOString() 
        : null
    }

    if (isEditing.value && currentProduct.value.id) {
      await $fetch(`${apiUrl}/products/${currentProduct.value.id}`, {
        method: 'PATCH',
        body,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } else {
      await $fetch(`${apiUrl}/products`, {
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    }
    isModalOpen.value = false
    await fetchProducts()
  } catch (err) {
    console.error('Failed to save product:', err)
    alert('Gagal menyimpan produk.')
  }
}

const openDeleteConfirm = (id: number) => {
  productToDelete.value = id
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!productToDelete.value) return
  
  isDeleting.value = true
  try {
    await $fetch(`${apiUrl}/products/${productToDelete.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    showDeleteConfirm.value = false
    productToDelete.value = null
    await fetchProducts()
  } catch (err) {
    console.error('Failed to delete product:', err)
    alert('Gagal menghapus produk.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchSubcategories()
  fetchBrands()
})
</script>

<template>
  <div class="product-management">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
        <p class="text-sm text-gray-400 mt-1">{{ filteredProducts.length }} produk ditemukan</p>
      </div>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Produk
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="relative group">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          v-model="filterSize"
          type="text"
          placeholder="Filter berdasarkan ukuran..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-colors"
        >
      </div>
      <div class="relative group">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </span>
        <input 
          v-model="filterColor"
          type="text"
          placeholder="Filter berdasarkan warna..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-colors"
        >
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex justify-between items-center">
      <span>{{ error }}</span>
      <button @click="fetchProducts" class="underline font-semibold">Coba Lagi</button>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat data...
      </div>

      <!-- Scrollable Table Wrapper -->
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[1200px]">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3 font-semibold w-14">#</th>
              <th class="px-4 py-3 font-semibold w-16">Gambar</th>
              <th class="px-4 py-3 font-semibold min-w-[180px]">Nama Produk</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Kategori</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Subkategori</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Brand</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Ukuran</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Warna</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Harga</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Harga Lama</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Diskon</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Flash Sale</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Stok</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Terjual</th>
              <th class="px-4 py-3 font-semibold whitespace-nowrap">Rating</th>
              <th class="px-4 py-3 font-semibold text-right whitespace-nowrap sticky right-0 bg-gray-50">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr
              v-for="(prod, index) in filteredProducts"
              :key="prod.id"
              class="hover:bg-blue-50/30 transition-colors"
            >
              <!-- # -->
              <td class="px-4 py-3 text-gray-400 font-medium text-xs">{{ index + 1 }}</td>

              <!-- Gambar -->
              <td class="px-4 py-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img v-if="prod.imageUrl" :src="prod.imageUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </td>

              <!-- Nama -->
              <td class="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{{ prod.name }}</td>

              <!-- Kategori -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{{ prod.category?.name }}</span>
              </td>

              <!-- Subkategori -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span v-if="prod.subcategory" class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{{ prod.subcategory?.name }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>

              <!-- Brand -->
              <td class="px-4 py-3 text-gray-600 whitespace-nowrap text-xs font-medium">{{ prod.brand?.name }}</td>

              <!-- Ukuran -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{{ prod.size || '—' }}</td>

              <!-- Warna -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{{ prod.color || '—' }}</td>

              <!-- Harga -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="font-bold text-gray-800">Rp {{ prod.price.toLocaleString() }}</span>
              </td>

              <!-- Harga Lama -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-gray-400 line-through text-xs">Rp {{ prod.oldPrice?.toLocaleString() || '0' }}</span>
              </td>

              <!-- Diskon -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span v-if="prod.discount" class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-bold">{{ prod.discount }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>

              <!-- Flash Sale -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  v-if="prod.isFlashSale" 
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clip-rule="evenodd" />
                  </svg>
                  FLASH
                </span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>

              <!-- Stok -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="prod.stock <= 5 ? 'text-red-600 font-bold' : 'text-gray-600'">{{ prod.stock }}</span>
              </td>

              <!-- Terjual -->
              <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ prod.sold }}</td>

              <!-- Rating -->
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-xs text-gray-600">{{ prod.rating }}</span>
                </div>
              </td>

              <!-- Aksi (Sticky) -->
              <td class="px-4 py-3 sticky right-0 bg-white group-hover:bg-blue-50/30">
                <div class="flex gap-1 justify-end">
                  <button
                    @click="openEditModal(prod)"
                    class="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="openDeleteConfirm(prod.id)"
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
            <tr v-if="filteredProducts.length === 0">
              <td colspan="16" class="px-6 py-16 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p class="text-gray-400 font-medium">Belum ada produk</p>
                <p class="text-gray-300 text-sm mt-1">Klik "Tambah Produk" untuk menambahkan.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        
        <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          <!-- 📦 Informasi Produk -->
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">📦 Informasi Produk</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div class="space-y-1 md:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Nama Produk <span class="text-red-400">*</span></label>
                <input 
                  v-model="currentProduct.name" 
                  type="text" 
                  placeholder="Masukkan nama produk..."
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                >
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-sm font-semibold text-gray-600">Deskripsi</label>
                <textarea
                  v-model="currentProduct.description"
                  rows="3"
                  placeholder="Masukkan deskripsi produk..."
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                ></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Ukuran</label>
                <input 
                  v-model="currentProduct.size"
                  type="text"
                  placeholder="Contoh: 40x40 cm"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                >
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Warna</label>
                <input 
                  v-model="currentProduct.color"
                  type="text"
                  placeholder="Contoh: Putih"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                >
              </div>
            </div>
          </div>

          <hr class="border-gray-100">

          <!-- 💰 Harga & Stok -->
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">💰 Harga & Stok</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Harga Lama</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input 
                    v-model="currentProduct.oldPrice"
                    type="number"
                    placeholder="0"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Diskon</label>
                <div class="relative">
                  <input 
                    v-model="currentProduct.discount"
                    type="text"
                    placeholder="10"
                    class="w-full px-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Harga Final <span class="text-xs text-blue-500 font-normal">(auto)</span></label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm font-bold">Rp</span>
                  <input 
                    v-model="currentProduct.price"
                    type="number"
                    placeholder="0"
                    class="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/40 font-semibold text-blue-700 transition-colors"
                  >
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Stok <span class="text-red-400">*</span></label>
                <input 
                  v-model="currentProduct.stock"
                  type="number"
                  placeholder="0"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
                >
              </div>
            </div>
          </div>

          <hr class="border-gray-100">

          <!-- 🏷️ Klasifikasi -->
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">🏷️ Klasifikasi</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Brand <span class="text-red-400">*</span></label>
                <select 
                  v-model="currentProduct.brandId"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white focus:border-blue-500 transition-colors"
                >
                  <option disabled :value="0">Pilih brand...</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Kategori <span class="text-red-400">*</span></label>
                <select 
                  v-model="currentProduct.categoryId"
                  @change="currentProduct.subcategoryId = null"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white focus:border-blue-500 transition-colors"
                >
                  <option disabled :value="0">Pilih kategori...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600">Subkategori</label>
                <select 
                  v-model="currentProduct.subcategoryId"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white focus:border-blue-500 transition-colors"
                >
                  <option :value="null">Tanpa Subkategori</option>
                  <option 
                    v-for="sub in subcategories.filter(s => s.categoryId === currentProduct.categoryId)" 
                    :key="sub.id" 
                    :value="sub.id"
                  >
                    {{ sub.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <hr class="border-gray-100">

          <!-- ⚡ Flash Sale -->
          <div class="space-y-3 p-4 rounded-xl border transition-colors" :class="currentProduct.isFlashSale ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-gray-100'">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold flex items-center gap-2" :class="currentProduct.isFlashSale ? 'text-orange-800' : 'text-gray-500'">
                <span>⚡ Flash Sale</span>
                <span v-if="currentProduct.isFlashSale" class="text-[10px] px-2 py-0.5 bg-orange-200 text-orange-700 rounded-full font-bold uppercase">Aktif</span>
              </label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="currentProduct.isFlashSale" type="checkbox" class="sr-only peer">
                <div class="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm"></div>
              </label>
            </div>
            
            <div v-if="currentProduct.isFlashSale" class="space-y-1">
              <label class="text-xs font-semibold text-orange-700 uppercase tracking-wider">Waktu Berakhir</label>
              <input 
                v-model="currentProduct.flashSaleEndsAt"
                type="datetime-local"
                class="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm"
              >
              <p class="text-[10px] text-orange-400">Setelah waktu ini habis, harga akan otomatis kembali normal.</p>
            </div>
          </div>

          <hr class="border-gray-100">

          <!-- 🖼️ Gambar Produk -->
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">🖼️ Gambar Produk</h4>
            <div class="pt-2">
              <!-- Preview -->
              <div v-if="currentProduct.imageUrl" class="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 mb-3">
                <img :src="currentProduct.imageUrl" class="w-full h-full object-contain" />
                <button 
                  @click="currentProduct.imageUrl = ''"
                  class="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full hover:bg-red-600 shadow-lg flex items-center justify-center text-sm transition-colors"
                >
                  &times;
                </button>
              </div>

              <!-- Upload Area -->
              <label 
                v-else
                class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': isUploading }"
              >
                <div v-if="!isUploading" class="flex flex-col items-center">
                  <svg class="w-12 h-12 mb-3 text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-500 group-hover:text-blue-600">Klik untuk upload gambar</span>
                  <span class="text-xs text-gray-400 mt-1">JPG, PNG • maks 5MB</span>
                </div>
                <div v-else class="flex flex-col items-center">
                  <div class="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mb-3"></div>
                  <span class="text-sm animate-pulse text-blue-600 font-medium">Mengunggah gambar...</span>
                </div>
                <input type='file' class="hidden" @change="handleFileUpload" :disabled="isUploading" accept="image/*" />
              </label>

              <!-- Manual URL -->
              <div class="mt-3 flex items-center gap-2">
                <div class="h-px flex-1 bg-gray-200"></div>
                <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">atau masukkan URL</span>
                <div class="h-px flex-1 bg-gray-200"></div>
              </div>
              <input 
                v-model="currentProduct.imageUrl" 
                type="text" 
                placeholder="https://example.com/image.jpg"
                class="w-full mt-2 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50 transition-colors"
              >
            </div>
          </div>

        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            @click="isModalOpen = false"
            class="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button 
            @click="saveProduct"
            :disabled="isUploading"
            class="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isEditing ? 'Update Produk' : 'Simpan Produk' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      :show="showDeleteConfirm"
      title="Hapus Produk?"
      message="Tindakan ini tidak dapat dibatalkan. Produk ini akan dihapus permanen dari katalog."
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
.product-management {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
