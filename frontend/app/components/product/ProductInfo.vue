<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart, Star } from 'lucide-vue-next'

const props = defineProps<{
  product: any
}>()

const quantity = ref(1)

const updateQuantity = (val: number) => {
  if (val < 1) return
  if (props.product.stock && val > props.product.stock) return
  quantity.value = val
}

const cartStore = useCartStore()
const isAdded = ref(false)

const handleAddToCart = () => {
  const token = useCookie('token')
  if (!token.value) {
    alert('Silakan login terlebih dahulu untuk menambah barang ke keranjang.')
    navigateTo('/login')
    return
  }

  cartStore.addToCart({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: props.product.imageUrl || ''
  }, quantity.value)

  isAdded.value = true
  setTimeout(() => isAdded.value = false, 2000)
}

const handleBuyNow = () => {
  handleAddToCart()
  navigateTo('/cart')
}
</script>

<template>
  <div class="product-info-panel">
    <!-- Header -->
    <div class="info-header">
      <h1 class="product-title">{{ product.name }}</h1>
      <div v-if="product.brand" class="brand-tag">{{ product.brand.name }}</div>
    </div>

    <!-- Stats -->
    <div class="product-stats">
      <div class="rating">
        <Star v-for="i in 5" :key="i" :size="14" :fill="i <= Math.round(product.rating || 0) ? '#f59e0b' : 'none'" :color="i <= Math.round(product.rating || 0) ? '#f59e0b' : '#ccc'" />
        <span class="ml-1 text-gray-600">({{ product.rating || 0 }})</span>
      </div>
      <div class="divider">|</div>
      <div class="sold-count">
        <span class="count">{{ product.sold || 0 }}</span> Terjual
      </div>
    </div>

    <!-- Pricing -->
    <div class="pricing-card">
      <div class="price-row">
        <span class="price-val">Rp {{ product.price?.toLocaleString() }}</span>
        <span v-if="product.discount" class="discount-badge">{{ product.discount }} OFF</span>
      </div>
      <div v-if="product.oldPrice" class="old-price">Rp {{ product.oldPrice?.toLocaleString() }}</div>
    </div>

    <!-- Details -->
    <div class="selection-section">
      <div v-if="product.size" class="spec-row">
        <label>Ukuran:</label>
        <span>{{ product.size }}</span>
      </div>
      <div v-if="product.color" class="spec-row">
        <label>Warna:</label>
        <span>{{ product.color }}</span>
      </div>

      <!-- Quantity -->
      <div class="quantity-row">
        <label>Kuantitas:</label>
        <div class="qty-selector">
          <button @click="updateQuantity(quantity - 1)">-</button>
          <input type="number" v-model="quantity" />
          <button @click="updateQuantity(quantity + 1)">+</button>
        </div>
        <span class="stock-info">Tersedia {{ product.stock }} buah</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="action-buttons">
      <button class="btn-secondary" @click="handleAddToCart" :disabled="isAdded">
        <ShoppingCart :size="18" />
        {{ isAdded ? 'Ditambahkan ✓' : 'Masukkan Keranjang' }}
      </button>
      <button class="btn-primary" @click="handleBuyNow">
        Beli Sekarang
      </button>
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
  flex-direction: column;
  gap: 0.5rem;
}

.brand-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0055aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a1a1a;
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
  gap: 2px;
}

.divider { color: #dbdbdb; }

.count { color: #222; font-weight: 600; }

.pricing-card {
  padding: 1rem 0;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-val {
  font-size: 2rem;
  font-weight: 700;
  color: #ee4d2d;
}

.old-price {
  font-size: 1rem;
  text-decoration: line-through;
  color: #929292;
  margin-top: 0.25rem;
}

.discount-badge {
  background: #ff424e;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.selection-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spec-row {
  display: flex;
  gap: 1rem;
  font-size: 0.9375rem;
}

.spec-row label {
  color: #757575;
  width: 80px;
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.quantity-row label {
  color: #757575;
  width: 80px;
  font-size: 0.9375rem;
}

.qty-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
}

.qty-selector button {
  width: 32px;
  height: 32px;
  background: #fdfdfd;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.qty-selector input {
  width: 50px;
  height: 32px;
  text-align: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-top: none;
  border-bottom: none;
  font-size: 1rem;
  -moz-appearance: textfield; /* Firefox */
}

/* Chrome, Safari, Edge, Opera */
.qty-selector input::-webkit-outer-spin-button,
.qty-selector input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stock-info {
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
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 4px;
}

.btn-secondary {
  background: #fff;
  border: 1px solid #ee4d2d;
  color: #ee4d2d;
}

.btn-secondary:hover {
  background: rgba(238, 77, 45, 0.05);
}

.btn-primary {
  background: #ee4d2d;
  border: none;
  color: white;
}

.btn-primary:hover {
  background: #f05d40;
}
</style>
