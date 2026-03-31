<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const emit = defineEmits(['back'])

const activeFilters = ref({
  priceRange: [0, 500000],
  brands: [] as string[],
  stock: 'all',
  colors: [] as string[],
  sizes: [] as string[],
  types: [] as string[],
  textures: [] as string[],
  qualities: [] as string[]
})

const products = ref<any[]>([])

const fetchProducts = async () => {
  try {
    const data = await $fetch<any[]>(`${apiUrl}/products`)
    products.value = data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

onMounted(() => {
  fetchProducts()
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Basic filtering logic (to be expanded)
    const brandMatch = activeFilters.value.brands.length === 0 || activeFilters.value.brands.includes(p.brand)
    const stockMatch = activeFilters.value.stock === 'all' || (activeFilters.value.stock === 'ready' && p.stock > 0)
    return brandMatch && stockMatch
  })
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}
</script>

<template>
  <div class="flooring-listing-view">
    <!-- Breadcrumbs -->
    <div class="breadcrumb-nav">
      <div class="container">
        <div class="breadcrumb-items">
          <button @click="emit('back')" class="back-btn"> Kembali</button>
          <span>|</span>
          <a href="#" @click.prevent="emit('back')">Beranda</a>
          <span>/</span>
          <a href="#" @click.prevent>ALL CATEGORIES</a>
          <span>/</span>
          <span class="active">Flooring</span>
        </div>
      </div>
    </div>

    <div class="container main-layout">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <h2 class="filter-title">FILTER</h2>
        
        <!-- Price Filter -->
        <div class="filter-group">
          <h3>HARGA</h3>
          <div class="price-inputs">
            <input type="text" placeholder="Harga Minimum">
            <input type="text" placeholder="Harga Maksimum">
          </div>
        </div>

        <!-- Brand Filter -->
        <div class="filter-group">
          <h3>MERK BRAND</h3>
          <div class="checkbox-list">
            <label v-for="brand in ['SIGNATURE', 'IKAD', 'PLATINUM', 'HABITAT', 'MILAN', 'DBS']" :key="brand">
              <input type="checkbox" :value="brand" v-model="activeFilters.brands">
              {{ brand }}
            </label>
          </div>
        </div>

        <!-- Stock Filter -->
        <div class="filter-group">
          <h3>STOK</h3>
          <div class="radio-list">
            <label><input type="radio" value="all" v-model="activeFilters.stock"> Semua Stok</label>
            <label><input type="radio" value="ready" v-model="activeFilters.stock"> Ready Stock</label>
          </div>
        </div>

        <!-- More filters (collapsed for now) -->
        <div class="filter-group" v-for="title in ['WARNA', 'UKURAN KERAMIK', 'JENIS KERAMIK', 'TEKSTUR KERAMIK', 'KUALITAS KERAMIK']" :key="title">
          <div class="filter-header">
            <h3>{{ title }}</h3>
            <span>+</span>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <div class="content">
        <h1 class="page-title">PRODUCT FLOORING</h1>
        
        <div class="product-grid">
          <div 
            v-for="p in filteredProducts" 
            :key="p.id" 
            class="product-card"
            :class="{ 'flash-sale-border': p.isFlashSale }"
          >
            <div class="card-image">
              <img :src="p.imageUrl || p.image" :alt="p.name">
              
              <!-- Flash Sale Badge -->
              <div v-if="p.isFlashSale" class="flash-sale-badge">
                <span class="bolt">⚡</span>
                <FlashSaleTimer :endsAt="p.flashSaleEndsAt" />
              </div>
            </div>
            <div class="card-info">
              <h3 class="product-name">{{ p.name }}</h3>
              <div class="stats">
                <span>Terjual: {{ p.sold }}</span>
              </div>
              <div class="price-wrapper">
                <div class="price">Rp {{ formatPrice(p.price) }}</div>
                <div v-if="p.oldPrice" class="old-price">Rp {{ formatPrice(p.oldPrice) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="no-results">
          Tidak ada produk yang sesuai dengan filter.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flooring-listing-view {
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 4rem;
}

.breadcrumb-nav {
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb-items a {
  text-decoration: none;
  color: inherit;
  font-weight: 600;
}

.breadcrumb-items .active {
  color: var(--primary-red);
  font-weight: 700;
}

.main-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  height: fit-content;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h3 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.price-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-inputs input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.checkbox-list, .radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-list label, .radio-list label {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #475569;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-red);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;
}

.product-card {
  background: white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid white;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1);
  border-color: #e2e8f0;
}

.card-image {
  aspect-ratio: 1;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  height: 2.2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.2;
}

.stats {
  font-size: 0.7rem;
  color: #64748b;
  margin: 0.25rem 0;
}

.price {
  font-size: 1rem;
  font-weight: 800;
  color: #dc2626;
}

.old-price {
  font-size: 0.75rem;
  color: #94a3b8;
  text-decoration: line-through;
}

.flash-sale-badge {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #dc2626, #f97316);
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}

.bolt {
  color: #fbbf24;
  font-size: 0.9rem;
  animation: pulse 1s infinite;
}

.flash-sale-border {
  border-color: #fca5a5 !important;
  background: #fffafa !important;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.no-results {
  text-align: center;
  padding: 4rem;
  color: #64748b;
  font-weight: 600;
}

@media (max-width: 1280px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 1024px) {
  .main-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
