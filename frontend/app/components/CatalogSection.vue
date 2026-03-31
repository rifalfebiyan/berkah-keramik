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

onMounted(() => {
  timer = setInterval(() => {
    if (remaining.value > 0) remaining.value--
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

// ── Products ─────────────────────────────────────────────────────────────
const products = [
  {
    name: 'Azzurra Floral Bloom 40×40',
    brand: 'MULIA',
    price: 75_000,
    oldPrice: 115_000,
    discount: 'Hemat 60%',
    badgeColor: '#E53935',
    stock: 5,
    image: '/fressia_white.jpg',
  },
  {
    name: 'Grani Wood Natural 60×60',
    brand: 'ROMAN',
    price: 183_750,
    oldPrice: 245_000,
    discount: 'Hemat 25%',
    badgeColor: '#E53935',
    stock: 22,
    image: '/keramik.jpg',
  },
  {
    name: 'Bianco Carrara Marble...',
    brand: 'NIRO',
    price: 248_000,
    oldPrice: 310_000,
    discount: 'Terlaris',
    badgeColor: '#00897B',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=80',
  },
  {
    name: 'Midnight Onyx Luxury...',
    brand: 'ASIA TILE',
    price: 493_000,
    oldPrice: 580_000,
    discount: 'Hot Item',
    badgeColor: '#E53935',
    stock: 16,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    name: 'Travertin Classic 60×60',
    brand: 'PLATINUM',
    price: 145_000,
    oldPrice: 195_000,
    discount: 'Hemat 25%',
    badgeColor: '#E53935',
    stock: 11,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  },
]

const fmt = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID')
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
      <div class="flash-cards">
        <div
          v-for="p in products"
          :key="p.name"
          class="flash-card"
          @click="emit('selectProduct', p)"
        >
          <div class="card-img-wrap">
            <span class="badge" :style="{ backgroundColor: p.badgeColor }">{{ p.discount }}</span>
            <img :src="p.image" :alt="p.name" class="card-img" />
          </div>
          <div class="card-body">
            <p class="card-name">{{ p.name }}</p>
            <div class="card-prices">
              <span class="card-price">{{ fmt(p.price) }}</span>
              <span class="card-old">{{ fmt(p.oldPrice) }}</span>
            </div>
            <div class="card-stock">
              <span class="stock-bar-wrap">
                <span
                  class="stock-bar-fill"
                  :style="{ width: `${Math.min(100, (p.stock / 30) * 100)}%` }"
                />
              </span>
              <span class="stock-text">{{ p.stock }} unit lagi</span>
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
