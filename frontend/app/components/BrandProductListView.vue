<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronDown, Star, ChevronRight, X } from 'lucide-vue-next'

const props = defineProps<{
  brand: string
}>()

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
const emit = defineEmits(['back'])

const activeFilters = ref({
  priceRange: [0, 1000000],
  brands: [props.brand.toUpperCase()]
})

const products = ref<any[]>([])
const brandList = ref<string[]>([])
const isLoading = ref(true)

const fetchBrands = async () => {
  try {
    const data = await $fetch<any[]>(`${apiUrl}/brands`)
    brandList.value = data.map((b: any) => b.name.toUpperCase())
  } catch (err) {
    console.error('Failed to fetch brands:', err)
  }
}

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const res = await $fetch<any>(`${apiUrl}/products`)
    const data = res.data || []
    products.value = data
    
    // Initial price range update
    if (data.length > 0) {
      const maxP = Math.max(...data.map((p: any) => p.price))
      activeFilters.value.priceRange[1] = Math.ceil(maxP / 10000) * 10000
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    isLoading.value = false
  }
}

const maxPriceVal = computed(() => {
  if (products.value.length === 0) return 1000000
  const max = Math.max(...products.value.map(p => p.price))
  return Math.ceil(max / 10000) * 10000
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const brandMatch = activeFilters.value.brands.length === 0 || 
                      activeFilters.value.brands.includes(p.brand?.name?.toUpperCase() || '')
    const priceMatch = p.price >= activeFilters.value.priceRange[0] && 
                      p.price <= activeFilters.value.priceRange[1]
    return brandMatch && priceMatch
  })
})

const formatPrice = (p: number) => {
  return new Intl.NumberFormat('id-ID').format(Math.round(p))
}

onMounted(async () => {
  await Promise.all([fetchBrands(), fetchProducts()])
})

// Update local brand filter if prop changes
watch(() => props.brand, (newBrand) => {
  if (newBrand) {
    activeFilters.value.brands = [newBrand.toUpperCase()]
  }
})
</script>

<template>
  <div class="brand-list-view">
    <div class="container main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="filter-section">
          <div class="filter-header">
            <span>Price</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content">
             <div class="price-inputs">
               <div class="range-info">IDR 0</div>
               <div class="range-info">IDR {{ formatPrice(activeFilters.priceRange[1]) }}</div>
             </div>
             <input 
               type="range" 
               min="0" 
               :max="maxPriceVal" 
               step="10000" 
               v-model="activeFilters.priceRange[1]" 
               class="slider" 
             />
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-header">
            <span>Merek Brand</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content brand-list">
            <div v-for="b in brandList" :key="b" class="brand-item">
              <input type="checkbox" :id="b" :value="b" v-model="activeFilters.brands" />
              <label :for="b">{{ b }}</label>
            </div>
            <div v-if="brandList.length === 0" class="text-[10px] text-gray-400">
              Memuat merek...
            </div>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <div class="content-header">
          <div class="header-left">
            <button class="btn-back" @click="emit('back')">
              <ChevronRight :size="18" style="transform: rotate(180deg)" />
              Kembali
            </button>
            <div class="results-count">{{ filteredProducts.length }} Produk</div>
          </div>
          <div class="sort-options">
            <span>Urutkan dari</span>
            <div class="sort-dropdown">
              Most Relevance <ChevronDown :size="14" />
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="py-20 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full mx-auto mb-4"></div>
          <p class="text-gray-400 text-sm">Memuat produk...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="no-results">
          Tidak ada produk yang sesuai dengan filter.
        </div>

        <div v-else class="product-grid">
          <div v-for="p in filteredProducts" :key="p.id" class="mitra10-card" @click="navigateTo(`/product/${p.id}`)">
            <div class="card-brand-logo">
               <img v-if="p.brand?.logoUrl" :src="p.brand.logoUrl" :alt="p.brand.name" class="p-brand-logo-img" />
               <div class="p-brand-logo-text">{{ p.brand?.name || 'GENERIC' }}</div>
            </div>
            
            <div class="p-image-box">
              <img :src="p.imageUrl || p.image" :alt="p.name" />
            </div>

            <div class="p-info">
              <div class="price-row">
                <span v-if="p.oldPrice" class="old-price">IDR {{ formatPrice(p.oldPrice) }}</span>
                <span v-if="p.discount" class="discount-label">{{ p.discount }}%</span>
              </div>
              <div class="main-price">IDR {{ formatPrice(p.price) }}</div>
              <h4 class="p-name">{{ p.name }}</h4>
              
              <div class="card-stats">
                <div class="stars">
                  <Star v-for="i in 5" :key="i" :size="12" fill="#ffcc00" color="#ffcc00" />
                  <span class="rating-val">{{ p.rating || 5 }}</span>
                </div>
                <span class="sold-text">{{ p.sold || 0 }} Terjual</span>
              </div>
            </div>
            
            <button class="favorite-heart" @click.stop>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.brand-list-view {
  background-color: white;
  padding: 2rem 0;
  min-height: 100vh;
}

.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
}

/* Sidebar Styling */
.sidebar {
  border-right: 1px solid #f1f5f9;
  padding-right: 1.5rem;
  position: sticky;
  top: 255px; /* Offset for AppHeader + ContentHeader */
  height: fit-content;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 1rem;
  cursor: pointer;
}

.price-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.slider {
  width: 100%;
  accent-color: var(--primary-blue);
}

.brand-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
}

.brand-item input {
  accent-color: var(--primary-blue);
}

/* Content Area */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 195px; /* Offset for AppHeader */
  background: white;
  z-index: 30;
  padding: 1rem 0;
  border-bottom: 1px solid #f8fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-back {
  background: none;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f8fafc;
  color: var(--primary-blue);
  border-color: var(--primary-blue);
}

.results-count {
  font-size: 0.875rem;
  color: #64748b;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.sort-dropdown {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Mitra10 Style Card */
.mitra10-card {
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1.25rem;
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
  background: white;
}

.mitra10-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-color: #e2e8f0;
}

.card-brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.p-brand-logo-img {
  max-width: 60px;
  max-height: 20px;
  object-fit: contain;
  opacity: 0.8;
}

.p-brand-logo-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.p-image-box {
  aspect-ratio: 1;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.p-image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s;
}

.mitra10-card:hover .p-image-box img {
  transform: scale(1.05);
}

.p-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.old-price {
  font-size: 0.75rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.discount-label {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 1rem;
}

.main-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: #236d90;
}

.p-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0.5rem 0;
  line-height: 1.4;
  height: 2.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-val {
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 4px;
}

.sold-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.favorite-heart {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s;
}

.favorite-heart:hover {
  color: #f87171;
}

.favorite-heart svg {
  width: 20px;
  height: 20px;
}

.no-results {
  text-align: center;
  padding: 4rem;
  color: #64748b;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .main-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}

@media (max-width: 640px) {
  .product-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}
</style>
