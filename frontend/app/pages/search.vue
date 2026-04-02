<script setup lang="ts">
import { Star, ChevronDown, Filter, X, Trash2, ChevronLeft, Search } from 'lucide-vue-next';
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const { toggleFavorite, isFavorited, fetchFavorites } = useFavorites();

// Initial fetch of favorites on client side
onMounted(() => {
  fetchFavorites();
});

// Filter States
const selectedCategoryId = ref<number | null>(null);
const selectedBrands = ref<string[]>([]);
const maxPriceValue = ref(2000000);
const sortOption = ref('relevance');
const showMobileFilter = ref(false);

const searchQuery = computed(() => route.query.q as string || '');

// Fetch Metadata for Filters
const { data: categories } = await useApiFetch<any[]>('/categories');
const { data: brandsRaw } = await useApiFetch<any[]>('/brands');
const brands = computed(() => brandsRaw.value?.map(b => b.name.toUpperCase()) || []);

// Main Products Fetch with Filters & Sort
const { data: products, pending, error } = await useApiFetch<any[]>(() => {
  let url = `/products?search=${encodeURIComponent(searchQuery.value)}&sort=${sortOption.value}`;
  if (selectedCategoryId.value) url += `&categoryId=${selectedCategoryId.value}`;
  url += `&maxPrice=${maxPriceValue.value}`;
  return url;
}, {
  watch: [selectedCategoryId, searchQuery, sortOption, maxPriceValue]
});

// Computed for filtering products by brands (Client-side brand filter)
const filteredProducts = computed(() => {
  if (!products.value) return [];
  return products.value.filter(p => {
    const brandMatch = selectedBrands.value.length === 0 || 
                      selectedBrands.value.includes(p.brand?.name?.toUpperCase() || '');
    return brandMatch;
  });
});

const maxPriceRange = computed(() => {
  if (!products.value || products.value.length === 0) return 2000000;
  const max = Math.max(...products.value.map(p => p.price));
  return Math.ceil(max / 100000) * 100000 || 2000000;
});

const resetFilters = () => {
  selectedCategoryId.value = null;
  selectedBrands.value = [];
  maxPriceValue.value = 2000000;
  sortOption.value = 'relevance';
};

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(Math.round(p));

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div class="search-page-view">
    <!-- Header results info -->
    <div class="search-header-sticky">
      <div class="container header-content">
        <div class="header-left">
          <button class="btn-back" @click="goBack">
            <ChevronLeft :size="18" />
            Kembali
          </button>
          <div class="results-count">{{ filteredProducts.length }} Produk "{{ searchQuery }}"</div>
        </div>
        
        <div class="header-right">
          <button class="mobile-filter-trigger" @click="showMobileFilter = true">
            <Filter :size="18" />
            <span>Filter</span>
          </button>
          
          <div class="sort-options">
            <span>Urutkan dari</span>
            <div class="sort-dropdown-container">
              <select v-model="sortOption" class="sort-select-ui">
                <option value="relevance">Most Relevance</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="latest">Terbaru</option>
              </select>
              <ChevronDown :size="14" class="dropdown-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container main-layout">
      <!-- Sidebar - Synchronized with Flooring UI -->
      <aside class="sidebar">
        <!-- Price Filter -->
        <div class="filter-section">
          <div class="filter-header">
            <span>Price</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content">
             <div class="price-inputs">
               <div class="range-info">IDR 0</div>
               <div class="range-info">IDR {{ formatPrice(maxPriceValue) }}</div>
             </div>
             <input 
               type="range" 
               min="0" 
               :max="maxPriceRange" 
               step="10000" 
               v-model.number="maxPriceValue" 
               class="slider" 
             />
          </div>
        </div>

        <!-- Category Filter -->
        <div class="filter-section">
          <div class="filter-header">
            <span>Kategori</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content brand-list">
            <div class="brand-item" :class="{ 'active-item': selectedCategoryId === null }" @click="selectedCategoryId = null">
              <span class="item-label">Semua Kategori</span>
            </div>
            <div v-for="cat in categories" :key="cat.id" class="brand-item" :class="{ 'active-item': selectedCategoryId === cat.id }" @click="selectedCategoryId = cat.id">
              <span class="item-label">{{ cat.name }}</span>
            </div>
          </div>
        </div>

        <!-- Brand Filter -->
        <div class="filter-section">
          <div class="filter-header">
            <span>Merek Brand</span>
            <ChevronDown :size="16" />
          </div>
          <div class="filter-content brand-list">
            <div v-for="b in brands" :key="b" class="brand-item checkbox-style">
              <input type="checkbox" :id="b" :value="b" v-model="selectedBrands" />
              <label :for="b">{{ b }}</label>
            </div>
          </div>
        </div>

        <!-- Subtle Reset -->
        <div class="filter-section reset-section">
           <button class="reset-link" @click="resetFilters">
             <X :size="14" />
             Reset Semua Filter
           </button>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <div v-if="pending" class="py-20 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary-blue rounded-full mx-auto mb-4"></div>
          <p class="text-gray-400 text-sm">Memuat produk pencarian...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="no-results">
          Tidak ada produk "{{ searchQuery }}" yang sesuai dengan filter.
        </div>

        <div v-else class="product-grid">
          <div 
            v-for="p in filteredProducts" 
            :key="p.id" 
            class="mitra10-card" 
            @click="navigateTo(`/product/${p.id}`)"
          >
            <div class="card-brand-logo">
               <img v-if="p.brand?.logoUrl" :src="p.brand.logoUrl" :alt="p.brand.name" class="p-brand-logo-img" />
               <div class="p-brand-logo-text">{{ p.brand?.name || 'GENERIC' }}</div>
            </div>
            
            <div class="p-image-box">
              <img :src="p.imageUrl || p.image || '/placeholder.png'" :alt="p.name" />
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
                  <Star v-for="i in 5" :key="i" :size="12" :fill="i <= (p.rating || 5) ? '#ffcc00' : 'none'" :color="i <= (p.rating || 5) ? '#ffcc00' : '#e2e8f0'" />
                  <span class="rating-val">{{ p.rating || 5 }}</span>
                </div>
                <span class="sold-text">{{ p.sold || 0 }} Terjual</span>
              </div>
            </div>
            
            <button 
              class="favorite-heart" 
              :class="{ 'is-active': isFavorited(p.id) }"
              @click.stop="toggleFavorite(p)"
            >
              <svg viewBox="0 0 24 24" :fill="isFavorited(p.id) ? '#f87171' : 'none'" :stroke="isFavorited(p.id) ? '#f87171' : 'currentColor'" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Filter Modal -->
    <Transition name="fade">
      <div v-if="showMobileFilter" class="mobile-filter-overlay" @click="showMobileFilter = false"></div>
    </Transition>
    <Transition name="slide-up">
      <div v-if="showMobileFilter" class="mobile-filter-sheet">
        <div class="sheet-header">
          <h3>Filter & Urutkan</h3>
          <button @click="showMobileFilter = false"><X :size="24" /></button>
        </div>
        <div class="sheet-content">
          <div class="sheet-section">
            <label class="section-label">Urutkan</label>
            <select v-model="sortOption" class="w-full p-3 border rounded-xl bg-gray-50 font-semibold mb-4 outline-none border-gray-200">
               <option value="relevance">Most Relevance</option>
               <option value="price_asc">Harga Terendah</option>
               <option value="price_desc">Harga Tertinggi</option>
               <option value="latest">Terbaru</option>
            </select>
          </div>
          <div class="sheet-section">
            <label class="section-label">Price Range (IDR {{ formatPrice(maxPriceValue) }})</label>
            <input type="range" min="0" :max="maxPriceRange" step="50000" v-model.number="maxPriceValue" class="slider w-full mt-2" />
          </div>
        </div>
        <div class="sheet-footer">
          <button class="apply-btn" @click="showMobileFilter = false">Tampilkan Hasil</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-page-view {
  background-color: white;
  min-height: 100vh;
  font-family: inherit;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header UI Consistency */
.search-header-sticky {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #1e3a8a;
  border-color: #1e3a8a;
}

.results-count {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
}

.sort-dropdown-container {
  position: relative;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.sort-select-ui {
  appearance: none;
  border: none;
  background: transparent;
  width: 100%;
  font-weight: 500;
  color: #1e293b;
  outline: none;
  cursor: pointer;
}

.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
}

.mobile-filter-trigger {
  display: none;
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  gap: 0.5rem;
  align-items: center;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2.5rem;
  padding-top: 2rem;
}

/* SIDEBAR - FLOORING STYLE */
.sidebar {
  border-right: 1px solid #f1f5f9;
  padding-right: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.filter-section {
  margin-bottom: 2.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 1.25rem;
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
  accent-color: #1e3a8a;
}

.brand-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.brand-item:hover .item-label {
  color: #1e3a8a;
}

.item-label {
  color: #64748b;
  font-weight: 500;
}

.brand-item.active-item .item-label {
  color: #1e3a8a;
  font-weight: 700;
}

.checkbox-style {
  gap: 0.75rem;
}

.checkbox-style input {
  accent-color: #1e3a8a;
  width: 14px;
  height: 14px;
}

.checkbox-style label {
  cursor: pointer;
  flex: 1;
}

.reset-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 1.5rem;
}

.reset-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.reset-link:hover {
  opacity: 1;
}

/* PRODUCT GRID - MITRA10 STYLE CARD */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

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
  box-shadow: 0 12px 30px rgba(0,0,0,0.05);
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
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.p-image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.6s;
}

.mitra10-card:hover .p-image-box img {
  transform: scale(1.05);
}

.p-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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
  color: #1e3a8a;
}

.p-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0.25rem 0;
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
  color: #1e293b;
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
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.favorite-heart:active svg {
  transform: scale(1.4);
}

.favorite-heart.is-active {
  color: #f87171;
}

/* NO RESULTS */
.no-results {
  text-align: center;
  padding: 6rem;
  color: #64748b;
  font-weight: 600;
  font-size: 1rem;
}

/* MOBILE RESPONSIVE UI */
@media (max-width: 1024px) {
  .main-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .mobile-filter-trigger { display: flex; }
  .sort-options { display: none; }
  .results-count { font-size: 0.75rem; }
}

@media (max-width: 640px) {
  .product-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .mitra10-card { padding: 0.85rem; border-radius: 0.75rem; }
  .p-name { font-size: 0.75rem; height: 2.1rem; }
  .main-price { font-size: 0.95rem; }
  .results-count { display: none; }
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease-out; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
