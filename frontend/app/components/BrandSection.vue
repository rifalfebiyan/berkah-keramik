<script setup lang="ts">
const emit = defineEmits(['brand-selected'])

const brands = [
  'American Standard', 'Asian Paints', 'Avian', 'DBS', 'Dekson', 'Dulux',
  'Meridian', 'Modena', 'Mowilex', 'Nippon Paint', 'Panasonic', 'Philips'
]
</script>

<template>
  <section class="brand-section">
    <div class="container">
      <div class="brand-card">
        <h3>MEREK PRODUK</h3>
        <div class="brand-grid">
          <div 
            v-for="brand in brands" 
            :key="brand" 
            class="brand-logo-placeholder"
            @click="emit('brand-selected', brand)"
          >
             <span>{{ brand }}</span>
          </div>
        </div>
        <div class="center-btn">
          <button class="btn-all-brands">LIHAT SEMUA MEREK</button>
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

.brand-section {
  padding: 4rem 0;
}

.brand-card {
  background: linear-gradient(135deg, var(--primary-blue) 0%, #1a4f69 100%), url('https://images.unsplash.com/photo-1581404917879-53e3431ca0f4?auto=format&fit=crop&q=80&w=1200');
  background-size: cover;
  background-position: center;
  border-radius: 1.5rem;
  padding: 3rem;
  color: white;
  text-align: center;
}

h3 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  letter-spacing: 2px;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.brand-logo-placeholder {
  background: white;
  height: 60px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: 800;
  font-size: 0.75rem;
  padding: 0.5rem;
}

.center-btn {
  display: flex;
  justify-content: center;
}

.btn-all-brands {
  background: white;
  border: none;
  padding: 0.75rem 2.5rem;
  border-radius: 0.25rem;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
}

.btn-all-brands:hover {
  background: #ffcc00;
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .brand-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
