<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['viewAll'])

const activeTab = ref('Keramik')
const categories = ['Keramik', 'Lantai Vinyl', 'Granite Tile', 'Campuran Perekat']

const products = ref([
  { id: 1, name: 'MILAN CERAMIC 40X40 FT...', brand: 'MILAN', sold: 55, price: '72.000', image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Keramik Dinding HABITAT KW1...', brand: 'HABITAT', sold: 25, price: '120.000', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb9f?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'HABITAT CERAMIC 50X50 FT CALINA PIX...', brand: 'HABITAT', sold: 22, price: '110.000', image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'KIA CERAMIC 50X50 FT HICKORY KW1', brand: 'KIA', sold: 2, price: '89.200', image: 'https://images.unsplash.com/photo-1534237172340-7d25a8a81814?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'IKAD CERAMIC 40X40 FT SX GALAXY GREY...', brand: 'IKAD', sold: 0, price: '72.000', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'MULIA CERAMIC FRESSIA WHITE 40X40', brand: 'MULIA', sold: 12, price: '65.000', image: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&q=80&w=400' },
])
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
          :key="cat"
          :class="['tab-btn', { active: activeTab === cat }]"
          @click="activeTab = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flooring-grid">
        <div v-for="p in products" :key="p.id" class="flooring-card">
          <div class="image-container">
            <img :src="p.image" :alt="p.name" />
          </div>
          <div class="product-details">
            <div class="brand-name">{{ p.brand }}</div>
            <h3 class="product-name">{{ p.name }}</h3>
            <div class="sold-count">Terjual: {{ p.sold }}</div>
            <div class="product-price">Rp {{ p.price }}</div>
          </div>
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

@media (max-width: 1200px) {
  .flooring-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .flooring-grid { grid-template-columns: repeat(2, 1fr); }
  .tab-navigation { overflow-x: auto; padding-bottom: 0.5rem; }
  .tab-btn { white-space: nowrap; }
}
</style>
