<script setup lang="ts">
import { ref } from 'vue'

const products = ref([
  { id: 1, name: 'Keramik Granit Premium', price: 125000, stock: 250, sold: 145, tag: 'Lantai', image: 'https://images.unsplash.com/photo-1596704017254-ca77884d4677?q=80&w=300&auto=format&fit=crop' },
  { id: 2, name: 'Keramik Kamar Mandi', price: 85000, stock: 180, sold: 98, tag: 'Dinding', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop' },
  { id: 3, name: 'Backsplash Dapur', price: 95000, stock: 120, sold: 67, tag: 'Dekorasi', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=300&auto=format&fit=crop' },
  { id: 4, name: 'Keramik Motif Kayu', price: 110000, stock: 300, sold: 210, tag: 'Lantai', image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=300&auto=format&fit=crop' },
  { id: 5, name: 'Keramik Teras Antislip', price: 75000, stock: 420, sold: 189, tag: 'Outdoor', image: 'https://images.unsplash.com/photo-1621905252507-b35242f8df49?q=80&w=300&auto=format&fit=crop' },
  { id: 6, name: 'Keramik Motif Marmer', price: 215000, stock: 150, sold: 45, tag: 'Lantai', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=300&auto=format&fit=crop' }
])

const formatPrice = (p: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(p).replace('Rp', 'Rp ')
}
</script>

<template>
  <div class="product-management">
    <div class="top-bar">
      <h2 class="section-title">Manajemen Produk</h2>
      <button class="add-btn">+ Tambah Produk</button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Cari produk...">
      </div>
      <button class="filter-btn">
        <span>🛒</span>
        Filter
      </button>
    </div>

    <!-- Product Grid -->
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="card-image">
          <img :src="product.image" :alt="product.name">
          <span class="tag-badge">{{ product.tag }}</span>
        </div>
        <div class="card-body">
          <h4 class="product-name">{{ product.name }}</h4>
          <div class="price-row">
            <span class="price">{{ formatPrice(product.price) }}</span>
            <span class="unit">per m²</span>
          </div>
          <div class="stock-info">
            <span>Stok: {{ product.stock }} m²</span>
            <span>Terjual: {{ product.sold }}</span>
          </div>
          <div class="card-actions">
            <button class="edit-btn">✏️ Edit</button>
            <button class="delete-btn">🗑️ Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-management {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.add-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #1d4ed8;
}

.toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: #3b82f6;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.card-image {
  height: 180px;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tag-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(37, 99, 235, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.card-body {
  padding: 20px;
}

.product-name {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1e293b;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}

.unit {
  font-size: 12px;
  color: #94a3b8;
}

.stock-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card-actions button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.edit-btn {
  background: #eff6ff;
  color: #1d4ed8;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.card-actions button:hover {
  opacity: 0.8;
}
</style>
