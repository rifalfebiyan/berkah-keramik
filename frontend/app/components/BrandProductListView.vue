<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, Star, ChevronRight, X } from 'lucide-vue-next'

const props = defineProps<{
  brand: string
}>()

const emit = defineEmits(['back'])

const brands = [
  'ZEHN', 'CERAMAX', 'PALOMA', 'TIDY', 'DUREVOLE', 'NERO SWITCH&SOCKET', 
  'FIXMAN', 'DEKKSON', 'MT.EDMA', 'NIRO', 'DURAWOOD', 'PANASONIC', 
  'BELLEZZA', 'BOSCH', 'ROMAN', 'PENGUIN', 'ELEGANZA', 'SCG', 'SHARP', 'PHILIPS'
]

const selectedFilterBrands = ref([props.brand.toUpperCase()])
const priceRange = ref([0, 361800])

// Mock products based on image
const products = ref([
  { 
    id: 1, 
    name: 'Infiniti Granite Lantai Revo Reynosa 60X60CM-1,44M2 Cream Glossy', 
    brand: 'Infiniti', 
    price: 142560, 
    oldPrice: 151200, 
    discount: '5.71%', 
    sold: 0, 
    stars: 5, 
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    logo: 'https://cdn-icons-png.flaticon.com/512/324/324128.png' // Placeholder for brand logo
  },
  { 
    id: 2, 
    name: 'Infiniti Granite Lantai Revo Xena 60X60CM-1,44M2 Grey Matt', 
    brand: 'Infiniti', 
    price: 201000, 
    oldPrice: 216000, 
    discount: '6.94%', 
    sold: 0, 
    stars: 5, 
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb9f?auto=format&fit=crop&q=80&w=400',
    logo: 'https://cdn-icons-png.flaticon.com/512/324/324128.png'
  },
  { 
    id: 3, 
    name: 'Infinit Grantie Lantai Revo Rotterdam 60X60CM-1,44M2 Grey Matt', 
    brand: 'Infiniti', 
    price: 201000, 
    oldPrice: 216000, 
    discount: '6.94%', 
    sold: 0, 
    stars: 5, 
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=400',
    logo: 'https://cdn-icons-png.flaticon.com/512/324/324128.png'
  },
  { 
    id: 4, 
    name: 'Infiniti Keramik Lantai Gigalito KW1 60X60/1.44M2 Hitam', 
    brand: 'Infiniti', 
    price: 241000, 
    oldPrice: 256000, 
    discount: '5.86%', 
    sold: 0, 
    stars: 5, 
    image: 'https://images.unsplash.com/photo-1534237172340-7d25a8a81814?auto=format&fit=crop&q=80&w=400',
    logo: 'https://cdn-icons-png.flaticon.com/512/324/324128.png'
  },
])

const formatPrice = (p: number) => {
  return new Intl.NumberFormat('id-ID').format(p)
}
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
               <div class="range-info">IDR {{ formatPrice(priceRange[1]) }}</div>
             </div>
             <input type="range" min="0" max="1000000" v-model="priceRange[1]" class="slider" />
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-header">
            <span>Merek</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content brand-list">
            <div v-for="b in brands" :key="b" class="brand-item">
              <input type="checkbox" :id="b" :value="b" v-model="selectedFilterBrands" />
              <label :for="b">{{ b }}</label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="content-area">
        <div class="content-header">
          <div class="header-left">
            <button class="btn-back" @click="emit('back')">
              <ChevronRight :size="18" style="transform: rotate(180deg)" />
              Kembali
            </button>
            <div class="results-count">{{ products.length }} Produk</div>
          </div>
          <div class="sort-options">
            <span>Urutkan dari</span>
            <div class="sort-dropdown">
              Most Relevance <ChevronDown :size="14" />
            </div>
          </div>
        </div>

        <div class="product-grid">
          <div v-for="p in products" :key="p.id" class="mitra10-card">
            <div class="card-brand-logo">
               <div class="mitra-logo-box">
                 <span class="m-red">Mitra</span><span class="m-blue">10</span>
               </div>
            </div>
            
            <div class="p-image-box">
              <img :src="p.image" :alt="p.name" />
            </div>

            <div class="p-badges">
               <!-- Simulated icons from image -->
               <div class="badge-icon secured">🛡️</div>
               <div class="badge-icon truck">🚚</div>
               <div class="badge-icon verified">✅</div>
               <div class="badge-icon chat">💬</div>
            </div>

            <div class="p-info">
              <div class="price-row">
                <span class="old-price">IDR {{ formatPrice(p.oldPrice) }}</span>
                <span class="discount-label">{{ p.discount }}</span>
              </div>
              <div class="main-price">IDR {{ formatPrice(p.price) }}</div>
              <h4 class="p-name">{{ p.name }}</h4>
              
              <div class="card-stats">
                <div class="stars">
                  <Star v-for="i in 5" :key="i" :size="12" fill="#ffcc00" color="#ffcc00" />
                  <span class="rating-val">{{ p.stars }}</span>
                </div>
                <span class="sold-text">{{ p.sold }} Terjual</span>
              </div>
            </div>
            
            <button class="favorite-heart">
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
  transition: box-shadow 0.3s;
}

.mitra10-card:hover {
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.card-brand-logo {
  margin-bottom: 1rem;
}

.mitra-logo-box {
  font-weight: 900;
  font-size: 1rem;
}

.m-red { color: #236d90; } /* Overridden to match theme blue */
.m-blue { color: #f59e0b; }

.p-image-box {
  aspect-ratio: 1;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.p-badges {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.badge-icon {
  font-size: 1.25rem;
  opacity: 0.8;
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
  color: var(--primary-red);
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
  bottom: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0;
}

.favorite-heart svg {
  width: 20px;
  height: 20px;
}
</style>
