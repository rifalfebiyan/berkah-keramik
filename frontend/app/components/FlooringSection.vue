<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Heart } from 'lucide-vue-next'

const emit = defineEmits(['viewAll'])
const config = useRuntimeConfig()

const activeTabId = ref<number | null>(null)
const { toggleFavorite, isFavorited, fetchFavorites } = useFavorites();

// Initial fetch of favorites
onMounted(() => {
  fetchFavorites();
});
const categories = ref<any[]>([])
const products = ref<any[]>([])
const isLoading = ref(true)

const fetchCategories = async () => {
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/categories`)
    categories.value = data
    if (data.length > 0) {
      activeTabId.value = data[0].id
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const fetchProducts = async () => {
  if (!activeTabId.value) return
  isLoading.value = true
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/products?categoryId=${activeTabId.value}`)
    products.value = data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  if (activeTabId.value) {
    await fetchProducts()
  }
})

watch(activeTabId, () => {
  fetchProducts()
})
</script>

<template>
  <section class="flooring-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          Koleksi Flooring Lengkap: Granit, Vinyl, Keramik & Lainnya! 🧱 🏠
        </h2>
        <a href="#" class="view-all" @click.prevent="emit('viewAll')">Lihat Semua Flooring</a>
      </div>

      <div class="tab-navigation">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['tab-btn', { active: activeTabId === cat.id }]"
          @click="activeTabId = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <div v-if="isLoading" class="py-12 text-center text-gray-400">
        <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat produk...
      </div>
      <div v-else-if="products.length === 0" class="py-12 text-center text-gray-400">
        <p>Belum ada produk di kategori ini.</p>
      </div>
      <div v-else class="flooring-grid">
        <div 
          v-for="p in products" 
          :key="p.id" 
          class="flooring-card" 
          @click="navigateTo(`/product/${p.id}`)"
        >
          <div class="image-container flex items-center justify-center bg-gray-50">
            <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.name" />
            <div v-else class="flex flex-col items-center text-gray-300">
              <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-[8px] font-bold uppercase tracking-wider">No Image</span>
            </div>
          </div>
          <div class="product-details">
            <div class="brand-info">
              <img v-if="p.brand?.logoUrl" :src="p.brand.logoUrl" :alt="p.brand.name" class="mini-brand-logo" />
              <div class="brand-name">{{ p.brand?.name || 'Merek Umum' }}</div>
            </div>
            <h3 class="product-name">{{ p.name }}</h3>
            <div class="sold-count">Terjual: {{ p.sold || 0 }}</div>
            <div class="product-price">Rp {{ (p.price || 0).toLocaleString('id-ID') }}</div>
          </div>

          <!-- Heart Icon Overlay -->
          <button 
            class="favorite-btn"
            :class="{ 'is-active': isFavorited(p.id) }"
            @click.stop="toggleFavorite(p)"
          >
            <Heart 
              :size="18" 
              :fill="isFavorited(p.id) ? '#f87171' : 'none'" 
              :stroke="isFavorited(p.id) ? '#f87171' : 'currentColor'" 
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.flooring-section {
  padding: 4rem 0;
  background-color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-all {
  color: #ee2d24;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  background: #fff5f5;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.view-all:hover {
  background: #fee2e2;
  transform: translateX(4px);
}

.tab-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 2rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.tab-btn.active {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
  box-shadow: 0 4px 12px rgba(35, 109, 144, 0.2);
}

.flooring-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.25rem;
}

.flooring-card {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid #f1f5f9;
  position: relative;
}

.flooring-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1);
  border-color: #e2e8f0;
}

.image-container {
  aspect-ratio: 1;
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.flooring-card:hover .image-container img {
  transform: scale(1.1);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.mini-brand-logo {
  height: 12px;
  width: auto;
  max-width: 40px;
  object-fit: contain;
  opacity: 0.7;
}

.brand-name {
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: black;
  height: 2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.25;
  margin: 0;
}

.sold-count {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

.product-price {
  font-size: 1rem;
  font-weight: 800;
  color: black;
}

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  transform: scale(0.8);
}

.flooring-card:hover .favorite-btn {
  opacity: 1;
  transform: scale(1);
}

.favorite-btn:hover {
  color: #f87171;
  background: #fef2f2;
}

.favorite-btn.is-active {
  opacity: 1;
  transform: scale(1);
  color: #f87171;
}

.favorite-btn:active {
  transform: scale(1.3);
}

@media (max-width: 1200px) {
  .flooring-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .flooring-grid { grid-template-columns: repeat(2, 1fr); }
  .tab-navigation { overflow-x: auto; padding-bottom: 0.5rem; }
  .tab-btn { white-space: nowrap; }
}
</style>
