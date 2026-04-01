<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

const fetchFlashSaleProducts = async () => {
  isLoading.value = true
  try {
    // We'll fetch all and filter by isFlashSale on the client for now, 
    // or we could add a query param to the backend if needed.
    const data = await $fetch<any[]>(`${config.public.apiUrl}/products`)
    products.value = data.filter(p => p.isFlashSale).slice(0, 5) // Show top 5 flash sales
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
})

const fmt = (n: number) =>
  'Rp ' + (n || 0).toLocaleString('id-ID')
</script>

<template>
  <section class="flash-section">
    <div class="flash-container">

      <!-- ── Header Bar ─────────────────────────────────────────── -->
      <div class="flash-header">

        <div class="flash-title-group">
          <!-- <div class="flash-icon">⚡</div> -->
           <div class="flash-icon">
            <img src="/special_promo.png" alt="special_promo" width="500" height="500"/>
           </div>
          <div>
            <div class="flash-title">SPECIAL PROMO</div>
            <div class="flash-sub">BERAKHIR DALAM</div>
          </div>
        </div>

        <!-- Countdown -->
        <div class="countdown">
          <div class="countdown-box">
            <span class="countdown-num">{{ hours() }}</span>
            <span class="countdown-label">JAM</span>
          </div>
          <span class="countdown-sep">:</span>
          <div class="countdown-box">
            <span class="countdown-num">{{ minutes() }}</span>
            <span class="countdown-label">MENIT</span>
          </div>
          <span class="countdown-sep">:</span>
          <div class="countdown-box">
            <span class="countdown-num">{{ seconds() }}</span>
            <span class="countdown-label">DETIK</span>
          </div>
        </div>

        <button class="deals-btn">Lihat Semua Promo →</button>
      </div>

      <!-- ── Product Cards ──────────────────────────────────────── -->
      <div v-if="isLoading" class="py-20 text-center text-white/70 col-span-full">
        <div class="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        Memuat penawaran spesial...
      </div>
      <div v-else-if="products.length === 0" class="py-20 text-center text-white/70 col-span-full">
        <p class="text-lg font-medium">Belum ada promo spesial saat ini.</p>
      </div>
      <div v-else class="flash-cards">
        <div
          v-for="p in products"
          :key="p.id"
          class="flash-card"
          @click="emit('selectProduct', p)"
        >
          <div class="card-img-wrap flex items-center justify-center bg-gray-800">
            <span v-if="p.discount" class="badge" style="background-color: #E53935">{{ p.discount }}</span>
            <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.name" class="card-img" />
            <div v-else class="flex flex-col items-center text-gray-500">
              <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-[8px] font-bold uppercase tracking-wider">No Image</span>
            </div>
          </div>
          <div class="card-body">
            <p class="card-name">{{ p.name }}</p>
            <div class="card-prices">
              <span class="card-price">{{ fmt(p.price) }}</span>
              <span v-if="p.oldPrice" class="card-old">{{ fmt(p.oldPrice) }}</span>
            </div>
            <div class="card-stock">
              <span class="stock-bar-wrap">
                <span
                  class="stock-bar-fill"
                  :style="{ width: `${Math.min(100, ((p.stock || 10) / 30) * 100)}%` }"
                />
              </span>
              <span class="stock-text">{{ p.stock || 0 }} unit lagi</span>
            </div>
            <p class="stock-label">STOCK TERBATAS!</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Section ─────────────────────────────────────── */
.flash-section {
  padding: 2.5rem 1rem;
  background-color: #f8f9fa;
}

.flash-container {
  max-width: 1280px;
  margin: 0 auto;
  background: #236d90;
  border-radius: 1.5rem;
  padding: 1.25rem 1.5rem 1.5rem;
  box-shadow: 0 6px 32px rgba(0, 208, 255, 0.35);
}

/* ── Header ──────────────────────────────────────── */
.flash-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.flash-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.flash-icon {
  font-size: 2rem;
  line-height: 1;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flash-title {
  font-size: 1.9rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.5px;
}

.flash-sub {
  font-size: 0.65rem;
  font-weight: 600;
  color: #ced9d8;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* Countdown */
.countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.countdown-box {
  background: #ffffff;
  color: rgb(5, 52, 134);
  border-radius: 8px;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
}

.countdown-num {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
}

.countdown-label {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 2px;
  opacity: 0.7;
}

.countdown-sep {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 4px;
}

/* Deals button */
.deals-btn {
  margin-left: 1rem;
  background: #ffffff;
  color: #236d90;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.deals-btn:hover {
  background: #cbd9e0;
}

/* ── Cards ───────────────────────────────────────── */
.flash-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.flash-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.flash-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.14);
}

/* Image */
.card-img-wrap {
  position: relative;
  aspect-ratio: 1;
  background: #f1f5f9;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.flash-card:hover .card-img {
  transform: scale(1.06);
}

.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
  z-index: 2;
}

/* Body */
.card-body {
  padding: 10px 10px 12px;
}

.card-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.2em;
}

.card-prices {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.card-price {
  font-size: 1rem;
  font-weight: 800;
  color: #000000;
}

.card-old {
  font-size: 0.72rem;
  color: #94a3b8;
  text-decoration: line-through;
}

/* Stock bar */
.card-stock {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.stock-bar-wrap {
  flex: 1;
  height: 5px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.stock-bar-fill {
  display: block;
  height: 100%;
  background: #e53935;
  border-radius: 99px;
  transition: width 0.3s;
}

.stock-text {
  font-size: 0.65rem;
  color: #64748b;
  white-space: nowrap;
}

.stock-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #e53935;
  letter-spacing: 0.5px;
  margin: 0;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 1024px) {
  .flash-cards { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .flash-cards { grid-template-columns: repeat(2, 1fr); }
  .flash-header { flex-direction: column; align-items: flex-start; }
  .countdown { margin-left: 0; }
  .deals-btn { margin-left: 0; width: 100%; text-align: center; }
}
</style>
