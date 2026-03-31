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
      body: formData
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
        body
      })
    } else {
      await $fetch(`${apiUrl}/products`, {
        method: 'POST',
        body
      })
    }
    isModalOpen.value = false
    await fetchProducts()
  } catch (err) {
    console.error('Failed to save product:', err)
    alert('Gagal menyimpan produk.')
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

  try {
    await $fetch(`${apiUrl}/products/${id}`, {
      method: 'DELETE'
    })
    await fetchProducts()
  } catch (err) {
    console.error('Failed to delete product:', err)
    alert('Gagal menghapus produk.')
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
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
      <button 
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        + Tambah Produk
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input 
          v-model="filterSize"
          type="text"
          placeholder="Filter berdasarkan ukuran..."
          class="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
        >
      </div>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🎨</span>
        <input 
          v-model="filterColor"
          type="text"
          placeholder="Filter berdasarkan warna..."
          class="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
        >
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex justify-between items-center">
      <span>{{ error }}</span>
      <button @click="fetchProducts" class="underline font-semibold">Coba Lagi</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat data...
      </div>

      <table v-else class="w-full text-left border-collapse overflow-x-auto block">
        <thead class="bg-gray-50 text-gray-500 text-sm uppercase">
          <tr>
            <th class="px-6 py-4 font-semibold">Nomor</th>
            <th class="px-6 py-4 font-semibold">Gambar</th>
            <th class="px-6 py-4 font-semibold">Nama Produk</th>
            <th class="px-6 py-4 font-semibold">Kategori</th>
            <th class="px-6 py-4 font-semibold">Subkategori</th>
            <th class="px-6 py-4 font-semibold">Brand</th>
            <th class="px-6 py-4 font-semibold">Ukuran</th>
            <th class="px-6 py-4 font-semibold">Warna</th>
            <th class="px-6 py-4 font-semibold">Harga</th>
            <th class="px-6 py-4 font-semibold">Harga Lama</th>
            <th class="px-6 py-4 font-semibold">Diskon</th>
            <th class="px-6 py-4 font-semibold">Flash Sale</th>
            <th class="px-6 py-4 font-semibold">Stok</th>
            <th class="px-6 py-4 font-semibold">Terjual</th>
            <th class="px-6 py-4 font-semibold">Rating</th>
            <th class="px-6 py-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
<tr
  v-for="(prod, index) in filteredProducts"
  :key="prod.id"
  class="hover:bg-gray-50 transition"
>

<!-- Nomor -->
<td class="px-6 py-4 text-gray-500 font-medium">
  {{ index + 1 }}
</td>

<!-- Gambar -->
<td class="px-6 py-4">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
      <img
        v-if="prod.imageUrl"
        :src="prod.imageUrl"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</td>

<!-- Nama Produk -->
<td class="px-6 py-4 font-semibold text-gray-800">
  {{ prod.name }}
</td>

<!-- Kategori -->
<td class="px-6 py-4 text-gray-600">
  {{ prod.category?.name }}
</td>

<!-- Subkategori -->
<td class="px-6 py-4">
  <span v-if="prod.subcategory" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
    {{ prod.subcategory?.name }}
  </span>
  <span v-else class="text-gray-300 italic text-xs">-</span>
</td>

<!-- Brand -->
<td class="px-6 py-4 text-gray-600">
  {{ prod.brand?.name }}
</td>

<!-- Ukuran -->
<td class="px-6 py-4 text-gray-600">
  {{ prod.size || '-' }}
</td>

<!-- Warna -->
<td class="px-6 py-4 text-gray-600">
  {{ prod.color || '-' }}
</td>

<!-- Harga -->
<td class="px-6 py-4 font-medium">
  Rp {{ prod.price.toLocaleString() }}
</td>

<!-- Harga Lama -->
<td class="px-6 py-4 text-gray-400 line-through">
  Rp {{ prod.oldPrice?.toLocaleString() || 0 }}
</td>

<!-- Diskon -->
<td class="px-6 py-4 text-green-600 font-semibold">
  {{ prod.discount || '-' }}
</td>

<!-- Flash Sale -->
<td class="px-6 py-4">
  <span 
    v-if="prod.isFlashSale" 
    class="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-bold"
  >
    ⚡ FLASH
  </span>
  <span v-else class="text-gray-300">-</span>
</td>

<!-- Stok -->
<td class="px-6 py-4">
  {{ prod.stock }}
</td>

<!-- Terjual -->
<td class="px-6 py-4">
  {{ prod.sold }}
</td>

<!-- Rating -->
<td class="px-6 py-4">
  ⭐ {{ prod.rating }}
</td>

<!-- Aksi -->
<td class="px-6 py-4">
  <div class="flex gap-2 justify-end">

    <button
      @click="openEditModal(prod)"
      class="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
    >
      ✏️
    </button>

    <button
      @click="deleteProduct(prod.id)"
      class="text-red-600 hover:bg-red-50 p-2 rounded-lg"
    >
      🗑️
    </button>

  </div>
</td>

</tr>
</tbody>
      </table>

      
    </div>

    <!-- Simple Modal Overlay -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

  <!-- Nama Produk -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Nama Produk</label>
    <input 
      v-model="currentProduct.name" 
      type="text" 
      placeholder="Masukkan nama produk..."
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
  </div>

  <!-- Deskripsi -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Deskripsi</label>
    <textarea
      v-model="currentProduct.description"
      placeholder="Masukkan deskripsi produk..."
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
    ></textarea>
  </div>

  <!-- Harga Lama -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Harga Lama (Opsional)</label>
    <input 
      v-model="currentProduct.oldPrice"
      type="number"
      placeholder="Masukkan harga lama"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
  </div>

  <!-- Ukuran & Warna -->
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1">
      <label class="text-sm font-semibold text-gray-600">Ukuran</label>
      <input 
        v-model="currentProduct.size"
        type="text"
        placeholder="Contoh: 40x40"
        class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
    </div>
    <div class="space-y-1">
      <label class="text-sm font-semibold text-gray-600">Warna</label>
      <input 
        v-model="currentProduct.color"
        type="text"
        placeholder="Contoh: Putih"
        class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
    </div>
  </div>

  <!-- Diskon -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Diskon (Opsional)</label>
    <input 
      v-model="currentProduct.discount"
      type="text"
      placeholder="Contoh: 10%"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
  </div>

  <!-- Harga -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Harga Terbaru <span class="text-xs text-blue-500 font-normal">(Otomatis jika ada diskon)</span></label>
    <input 
      v-model="currentProduct.price"
      type="number"
      placeholder="Masukkan harga"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/30"
    >
  </div>

  <!-- Stock -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Stock</label>
    <input 
      v-model="currentProduct.stock"
      type="number"
      placeholder="Masukkan jumlah stok"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
  </div>

  <!-- Brand -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Brand</label>
    <select 
      v-model="currentProduct.brandId"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
    >
      <option v-for="brand in brands" :key="brand.id" :value="brand.id">
        {{ brand.name }}
      </option>
    </select>
  </div>

  <!-- Category -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Kategori</label>
    <select 
      v-model="currentProduct.categoryId"
      @change="currentProduct.subcategoryId = null"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
    >
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
  </div>

  <!-- Subcategory -->
  <div class="space-y-1">
    <label class="text-sm font-semibold text-gray-600">Subkategori</label>
    <select 
      v-model="currentProduct.subcategoryId"
      class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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

  <!-- Flash Sale Section -->
  <div class="space-y-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
    <div class="flex items-center justify-between">
      <label class="text-sm font-bold text-orange-800 flex items-center gap-2">
        <span>⚡ Flash Sale</span>
      </label>
      <input 
        v-model="currentProduct.isFlashSale"
        type="checkbox"
        class="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
      >
    </div>
    
    <div v-if="currentProduct.isFlashSale" class="space-y-1 animate-fadeIn">
      <label class="text-xs font-semibold text-orange-700 uppercase tracking-wider">Waktu Berakhir</label>
      <input 
        v-model="currentProduct.flashSaleEndsAt"
        type="datetime-local"
        class="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-sm"
      >
      <p class="text-[10px] text-orange-400">Setelah waktu ini habis, harga akan otomatis kembali normal.</p>
    </div>
  </div>

  <!-- Image -->
  <div class="space-y-2">
    <label class="text-sm font-semibold text-gray-600">Gambar Produk</label>
    
    <!-- Preview -->
    <div v-if="currentProduct.imageUrl" class="relative w-full h-40 rounded-xl overflow-hidden border bg-gray-50 mb-2">
      <img :src="currentProduct.imageUrl" class="w-full h-full object-contain" />
      <button 
        @click="currentProduct.imageUrl = ''"
        class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
      >
        <span class="block w-4 h-4 flex items-center justify-center leading-none">&times;</span>
      </button>
    </div>

    <!-- Upload Button -->
    <div class="flex items-center gap-3">
      <label 
        class="flex-1 flex flex-col items-center px-4 py-4 bg-white text-blue rounded-xl tracking-wide border border-blue cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors border-dashed"
        :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
      >
        <span v-if="!isUploading" class="text-sm">Klik untuk upload gambar</span>
        <span v-else class="text-sm animate-pulse text-blue-600">Mengunggah...</span>
        <input type='file' class="hidden" @change="handleFileUpload" :disabled="isUploading" accept="image/*" />
      </label>
    </div>

    <!-- Manual URL Input (Fallback) -->
    <div class="mt-2">
      <label class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Atau masukkan URL</label>
      <input 
        v-model="currentProduct.imageUrl" 
        type="text" 
        placeholder="https://example.com/image.jpg"
        class="w-full px-4 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
      >
    </div>
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
            @click="saveProduct"
            class="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            {{ isEditing ? 'Update Produk' : 'Simpan Produk' }}
          </button>
        </div>
      </div>
    </div>
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
