<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Heart } from 'lucide-vue-next'

const emit = defineEmits(['selectProduct'])

// ── Countdown Timer ──────────────────────────────────────────────────────
const TARGET_SECONDS = 2 * 3600 + 45 * 60 + 12   // 2j 45m 12d
const remaining = ref(TARGET_SECONDS)
let timer: ReturnType<typeof setInterval>

const pad = (n: number) => String(n).padStart(2, '0')
const hours   = () => pad(Math.floor(remaining.value / 3600))
const minutes = () => pad(Math.floor((remaining.value % 3600) / 60))
const seconds = () => pad(remaining.value % 60)

// ── Products ─────────────────────────────────────────────────────────────
const config = useRuntimeConfig()
const products = ref<any[]>([])
const isLoading = ref(true)

const { toggleFavorite, isFavorited, fetchFavorites } = useFavorites();

const isFallback = ref(false)

const fetchFlashSaleProducts = async () => {
  isLoading.value = true
  isFallback.value = false
  try {
    const data = await $fetch<any[]>(`${config.public.apiUrl}/products`)
    // Filter by isFlashSale
    let filtered = data.filter(p => p.isFlashSale)
    
    // Fallback: If no flash sale products, just take the first 5 latest products
    if (filtered.length === 0) {
       filtered = data.slice(0, 5)
       isFallback.value = true
    }
    
    products.value = filtered.slice(0, 5)
  } catch (err) {
    console.error('Failed to fetch flash sale products:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFlashSaleProducts()
  
  timer = setInterval(() => {
    if (remaining.value > 0) remaining.value--
  }, 1000)

  fetchFavorites();
})

onUnmounted(() => {
  clearInterval(timer)
})

const fmt = (n: number) =>
  'Rp ' + (n || 0).toLocaleString('id-ID')
</script>

<template>
  <section class="flash-section">
    <div class="flash-container">

      <!-- ── Header Bar ─────────────────────────────────────────── -->
      <div class="flash-header">
        <div class="header-left">
          <div class="flash-brand">
             <div class="brand-logo">
                <img src="/special_promo.png" alt="Flash Sale" />
             </div>
             <div class="brand-text">
                <h2 class="title">{{ isFallback ? 'KATALOG TERBARU' : 'SPECIAL PROMO' }}</h2>
                <span class="subtitle">{{ isFallback ? 'KOLEKSI PILIHAN UNTUK HUNIAN ANDA' : 'PENAMPILAN TERBAIK, HARGA TERHEMAT' }}</span>
             </div>
          </div>

          <div v-if="!isFallback" class="countdown-wrapper">
             <span class="timer-label">BERAKHIR DALAM</span>
             <div class="timer-boxes">
                <div class="timer-box">{{ hours() }}</div>
                <span class="timer-sep">:</span>
                <div class="timer-box">{{ minutes() }}</div>
                <span class="timer-sep">:</span>
                <div class="timer-box">{{ seconds() }}</div>
             </div>
          </div>
        </div>

        <button class="view-all-btn">
          Lihat Semua <span class="arrow">→</span>
        </button>
      </div>

      <!-- ── Product Grid ──────────────────────────────────────── -->
      <div v-if="isLoading" class="loader-container">
        <div class="pulse-loader"></div>
        <p>Menyiapkan penawaran spesial...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">⚡</div>
        <p>Belum ada produk promo saat ini.</p>
        <p class="sub">Pantau terus untuk kejutan harga menarik!</p>
      </div>

      <div v-else class="product-grid">
        <div
          v-for="p in products"
          :key="p.id"
          class="promo-card"
          @click="emit('selectProduct', p)"
        >
          <!-- Image Area -->
          <div class="card-media">
            <span v-if="p.discount" class="discount-tag">-{{ p.discount }}%</span>
            <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.name" />
            <div v-else class="no-image">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div v-if="!isFallback" class="urgency-overlay">HANYA HARI INI!</div>
            <button 
              class="heart-btn"
              :class="{ 'is-active': isFavorited(p.id) }"
              @click.stop="toggleFavorite(p)"
            >
               <Heart :size="16" :fill="isFavorited(p.id) ? '#ef4444' : 'none'" />
            </button>
          </div>

          <!-- Content Area -->
          <div class="card-info">
            <h3 class="product-name">{{ p.name }}</h3>
            
            <div class="price-section">
               <span class="current-price">{{ fmt(p.price) }}</span>
               <span v-if="p.oldPrice" class="old-price">{{ fmt(p.oldPrice) }}</span>
            </div>

            <div class="stock-progress">
               <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${Math.min(100, ((p.stock || 0) / 20) * 100)}%` }"
                  ></div>
               </div>
               <span class="stock-status">{{ p.stock || 0 }} unit lagi</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.flash-section {
  padding: 2rem 1rem;
  background-color: #f3f4f6;
}

.flash-container {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 40px rgba(30, 58, 138, 0.25);
  position: relative;
  overflow: hidden;
}

.flash-container::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

/* ── Header ──────────────────────────────────────── */
.flash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.flash-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-text .title {
  font-size: 1.4rem;
  font-weight: 900;
  color: white;
  margin: 0;
  line-height: 1;
}

.brand-text .subtitle {
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.countdown-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timer-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

.timer-boxes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.timer-box {
  background: #ffffff;
  color: #1e3a8a;
  width: 36px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
}

.timer-sep {
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
}

.view-all-btn {
  background: rgba(255,255,255,0.15);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: white;
  color: #1e3a8a;
}

/* ── Product Grid ──────────────────────────────────────── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.promo-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.promo-card:hover {
  transform: translateY(-4px);
}

.card-media {
  position: relative;
  aspect-ratio: 4/3;
  background: #f8fafc;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  z-index: 2;
}

.heart-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.heart-btn.is-active {
  color: #ef4444;
}

.heart-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.heart-btn:active {
  transform: scale(1.4);
}

.urgency-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  font-size: 0.55rem;
  font-weight: 800;
  text-align: center;
  padding: 2px 0;
}

.card-info {
  padding: 0.6rem;
}

.product-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2rem;
  line-height: 1.3;
}

.price-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.old-price {
  font-size: 0.65rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-top: 1px;
}

.stock-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 3px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ef4444;
}

.stock-status {
  font-size: 0.65rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.loader-container, .empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: white;
}

.pulse-loader {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .header-left { gap: 1.5rem; }
}

@media (max-width: 640px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .brand-text .title { font-size: 1.1rem; }
  .header-left { gap: 1rem; }
  .countdown-wrapper { display: none; }
}
</style>
