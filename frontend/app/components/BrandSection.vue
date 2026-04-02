<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { $api } = useNuxtApp()
const emit = defineEmits(['brand-selected'])

interface Brand {
  id: number
  name: string
  logoUrl: string | null
}

const brands = ref<Brand[]>([])
const isLoading = ref(false)

const fetchBrands = async () => {
  isLoading.value = true
  try {
    const data = await $api<Brand[]>('/brands')
    brands.value = data
  } catch (err) {
    console.error('Failed to fetch brands:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBrands()
})
</script>

<template>
  <section class="brand-section">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 text-center">
         <div class="animate-spin w-6 h-6 border-4 border-gray-200 border-t-primary-blue rounded-full mx-auto mb-4"></div>
         <p class="text-gray-400 text-xs text-uppercase tracking-wider">Memuat brand...</p>
      </div>

      <div v-else class="content-wrapper">
        <h3 class="section-title">Brand Produk</h3>
        <div class="brand-grid">
          <div 
            v-for="brand in brands" 
            :key="brand.id" 
            class="brand-item group"
            @click="emit('brand-selected', brand.name)"
          >
            <div class="logo-wrapper">
              <img 
                v-if="brand.logoUrl" 
                :src="brand.logoUrl" 
                :alt="brand.name"
                class="brand-logo transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
              />
              <div v-else class="logo-text-fallback">
                {{ brand.name }}
              </div>
            </div>
            <span class="brand-name">{{ brand.name }}</span>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.brand-section {
  padding: 1.5rem 0;
  background-color: #f9fafb;
}

.content-wrapper {
  text-align: center;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.logo-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: all 0.3s ease;
}

.brand-item:hover .logo-wrapper {
  transform: translateY(-2px);
}

.brand-logo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  mix-blend-mode: multiply; /* Helps logos blend into the light background */
}

.brand-name {
  font-size: 0.65rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}

.brand-item:hover .brand-name {
  color: var(--primary-blue);
}

.logo-text-fallback {
  font-size: 0.875rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.center-btn {
  display: flex;
  justify-content: center;
}

.btn-all-brands {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 0.35rem 1.25rem;
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.btn-all-brands:hover {
  background: white;
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .brand-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
