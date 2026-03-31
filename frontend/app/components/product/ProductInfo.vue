<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart, Star } from 'lucide-vue-next'

const props = defineProps<{
  product: {
    name: string
    brand: string
    price: string
    oldPrice?: string
    discount?: string
    rating: number
    reviews: string
    variants: { name: string, image: string }[]
  }
}>()

const activeVariant = ref(0)
const quantity = ref(1)

const updateQuantity = (val: number) => {
  if (val < 1) return
  quantity.value = val
}
</script>

<template>
  <div class="product-info-panel">
    <!-- Header -->
    <div class="info-header">
      <div class="star-badge">Star+</div>
      <h1 class="product-title">{{ product.name }}</h1>
    </div>

    <!-- Stats -->
    <div class="product-stats">
      <div class="rating">
        <span class="score">{{ product.rating }}</span>
        <div class="stars">
          <Star v-for="i in 5" :key="i" :size="14" :fill="i <= 4 ? 'var(--primary-red)' : 'none'" :color="i <= 4 ? 'var(--primary-red)' : '#ccc'" />
        </div>
      </div>
      <div class="divider">|</div>
      <div class="reviews-count">
        <span class="count">{{ product.reviews }}</span> Penilaian
      </div>
      <div class="divider">|</div>
      <div class="sold-count">
        <span class="count">13</span> Terjual
      </div>
    </div>

    <!-- Pricing -->
    <div class="pricing-card">
      <div v-if="product.oldPrice" class="old-price">Rp{{ product.oldPrice }}</div>
      <div class="current-price-row">
        <span class="price-val">Rp{{ product.price }}</span>
        <span v-if="product.discount" class="discount-badge">{{ product.discount }} OFF</span>
      </div>
    </div>

    <!-- Details -->
    <div class="selection-section">
      <!-- Variants -->
      <div class="selection-row" v-if="product.variants.length > 0">
        <label>WARNA</label>
        <div class="variants-grid">
          <button 
            v-for="(v, idx) in product.variants" 
            :key="idx"
            :class="['variant-btn', { active: activeVariant === idx }]"
            @click="activeVariant = idx"
          >
            <img :src="v.image" :alt="v.name" />
            <span>{{ v.name }}</span>
          </button>
        </div>
      </div>

      <!-- Quantity -->
      <div class="selection-row">
        <label>KUANTITAS</label>
        <div class="qty-selector">
          <button @click="updateQuantity(quantity - 1)">-</button>
          <input type="number" v-model="quantity" />
          <button @click="updateQuantity(quantity + 1)">+</button>
        </div>
        <span class="stock-info">tersedia baran 13</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="action-buttons">
      <button class="btn-secondary">
        <ShoppingCart :size="18" />
        Masukkan Keranjang
      </button>
      <button class="btn-primary">
        Beli Sekarang
      </button>
    </div>

    <!-- Safety Badge -->
    <div class="safety-badge">
       <span>🛡️ Bebas Pengembalian • Proteksi Kerusakan + ⌄</span>
    </div>
  </div>
</template>

<style scoped>
.product-info-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-header {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.star-badge {
  background: var(--primary-red);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 2px;
  margin-top: 4px;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  color: #222;
}

.product-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-bottom: 1px solid var(--primary-red);
  color: var(--primary-red);
}

.score {
  font-weight: 700;
  font-size: 1rem;
}

.stars { display: flex; gap: 1px; }

.reviews-count, .sold-count {
  border-bottom: 1px solid #222;
  color: #757575;
}

.count { color: #222; font-weight: 500; }

.divider { color: #dbdbdb; }

.pricing-card {
  background: #fafafa;
  padding: 1rem;
  border-radius: 4px;
}

.old-price {
  font-size: 0.875rem;
  text-decoration: line-through;
  color: #929292;
  margin-bottom: 0.25rem;
}

.current-price-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-val {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--primary-blue);
}

.discount-badge {
  background: var(--primary-red);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 2px;
}

.selection-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.selection-row {
  display: flex;
  align-items: center;
}

.selection-row label {
  width: 110px;
  font-size: 0.875rem;
  color: #757575;
  text-transform: uppercase;
}

.variants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 12px 4px 4px;
  border: 1px solid rgba(0,0,0,0.09);
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 2px;
}

.variant-btn.active {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.variant-btn img {
  width: 24px;
  height: 24px;
  object-fit: cover;
}

.qty-selector {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.09);
  border-radius: 2px;
}

.qty-selector button {
  width: 32px;
  height: 32px;
  background: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.qty-selector input {
  width: 50px;
  height: 32px;
  text-align: center;
  border-left: 1px solid rgba(0,0,0,0.09);
  border-right: 1px solid rgba(0,0,0,0.09);
  border-top: none;
  border-bottom: none;
  font-size: 1rem;
}

.stock-info {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  height: 48px;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: rgba(13, 27, 62, 0.05);
  border: 1px solid var(--primary-blue);
  color: var(--primary-blue);
}

.btn-primary {
  background: var(--primary-yellow);
  border: none;
  color: var(--primary-blue);
}

.safety-badge {
  font-size: 0.875rem;
  color: #222;
  margin-top: 1rem;
}
</style>
