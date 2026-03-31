<script setup lang="ts">
import { ref, computed } from 'vue'

const customer = ref({
  name: 'lifa',
  phone: '08575',
  address: 'bekasi'
})

const selectedProduct = ref({
  id: 3,
  name: 'Backsplash Dapur',
  price: 95000,
  stock: 120,
  image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=300&auto=format&fit=crop'
})

const quantity = ref(14)

const subtotal = computed(() => quantity.value * selectedProduct.value.price)
const tax = computed(() => subtotal.value * 0.11)
const total = computed(() => subtotal.value + tax.value)

const formatPrice = (p: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(p).replace('Rp', 'Rp ')
}
</script>

<template>
  <div class="cashier-view">
    <div class="pos-layout">
      <!-- Left Column: Forms -->
      <div class="pos-left">
        <!-- Customer Info -->
        <div class="pos-card customer-section">
          <h3>Informasi Pelanggan</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Pelanggan *</label>
              <input type="text" v-model="customer.name" placeholder="Nama">
            </div>
            <div class="form-group">
              <label>No. Telepon</label>
              <input type="text" v-model="customer.phone" placeholder="08...">
            </div>
            <div class="form-group full-width">
              <label>Alamat</label>
              <textarea v-model="customer.address" placeholder="Alamat lengkap..."></textarea>
            </div>
          </div>
        </div>

        <!-- Product Add -->
        <div class="pos-card add-product-section">
          <h3>Tambah Produk</h3>
          <div class="search-box">
             <span class="search-icon">🔍</span>
             <input type="text" placeholder="Cari produk...">
          </div>

          <!-- Product Preview (Selected) -->
          <div class="selected-product-preview">
            <img :src="selectedProduct.image" :alt="selectedProduct.name">
            <div class="preview-info">
              <h4>{{ selectedProduct.name }}</h4>
              <p class="price-info">Harga per m²: <strong>{{ formatPrice(selectedProduct.price) }}</strong></p>
              <span class="stock-badge">Stok tersedia: {{ selectedProduct.stock }} m²</span>
            </div>
          </div>

          <div class="add-controls">
            <div class="form-group">
              <label>Produk *</label>
              <select>
                <option>{{ selectedProduct.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Jumlah (m²) *</label>
              <input type="number" v-model="quantity">
            </div>
            <div class="total-preview">
              <span>Total:</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
              <small>Sisa stok: {{ selectedProduct.stock - quantity }} m²</small>
            </div>
            <button class="add-to-cart-btn">+ Tambah</button>
          </div>
        </div>
      </div>

      <!-- Right Column: Summary -->
      <div class="pos-right">
        <div class="pos-card summary-card">
          <h3>Ringkasan Pesanan</h3>
          
          <div class="summary-details">
            <div class="summary-row">
              <span class="label">Jumlah Item:</span>
              <span class="value">1</span>
            </div>
            <div class="summary-row">
              <span class="label">Total m²:</span>
              <span class="value">{{ quantity }} m²</span>
            </div>
            
            <div class="divider"></div>

            <div class="summary-row">
              <span class="label">Subtotal:</span>
              <span class="value">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Pajak (11%):</span>
              <span class="value">{{ formatPrice(tax) }}</span>
            </div>
            
            <div class="total-row">
              <span class="label">Total:</span>
              <span class="grand-total">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <button class="checkout-btn">
            <span class="icon">🛒</span>
            Buat Pesanan & Cetak
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cashier-view {
  width: 100%;
}

.pos-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.pos-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.pos-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1e293b;
}

.pos-left {
  display: flex;
  flex-direction: column;
}

/* Form Styling */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  outline: none;
  background: #f8fafc;
}

.form-group textarea {
  height: 80px;
  resize: none;
}

/* Product Search & Preview */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.selected-product-preview {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #eff6ff;
  border-radius: 16px;
  margin-bottom: 24px;
}

.selected-product-preview img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.preview-info h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
}

.price-info {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.stock-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.add-controls {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 16px;
  align-items: flex-end;
}

.total-preview {
  display: flex;
  flex-direction: column;
}

.total-preview span {
  font-size: 12px;
  color: #64748b;
}

.total-preview strong {
  color: #3b82f6;
  font-size: 15px;
}

.total-preview small {
  font-size: 10px;
  color: #94a3b8;
}

.add-to-cart-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* Summary Card */
.summary-card {
  position: sticky;
  top: 104px;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.grand-total {
  font-size: 20px;
  font-weight: 800;
  color: #3b82f6;
}

.checkout-btn {
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 1200px) {
  .pos-layout {
    grid-template-columns: 1fr;
  }
}
</style>
