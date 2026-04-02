<script setup lang="ts">
import ProductGallery from './product/ProductGallery.vue'
import ProductInfo from './product/ProductInfo.vue'
import ProductTabs from './product/ProductTabs.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  product: any
}>()

const emit = defineEmits(['back'])
const router = useRouter()
</script>

<template>
  <div class="product-detail-page">
    <!-- Breadcrumbs Nav Bar -->
    <div class="breadcrumb-nav">
      <div class="container">
        <div class="breadcrumb-items">
          <button @click="emit('back')" class="back-btn"> Kembali</button>
          <span class="sep-pipe">|</span>
          <a href="#" @click.prevent="router.push('/')">Beranda</a>
          <template v-if="product.category">
            <span class="sep-slash">/</span>
            <a href="#" @click.prevent="router.push(`/category/${product.category.id}`)">
              {{ product.category.name }}
            </a>
          </template>
          <template v-if="product.subcategory">
            <span class="sep-slash">/</span>
            <a href="#" @click.prevent="router.push(`/subcategory/${product.subcategory.id}`)">
              {{ product.subcategory.name }}
            </a>
          </template>
          <span class="sep-slash">/</span>
          <span class="active">{{ product.name }}</span>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Main Content Container -->
      <div class="product-main-card">
        <div class="gallery-col">
          <ProductGallery 
            :imageUrl="product.imageUrl" 
            :images="product.images || []" 
          />
        </div>
        <div class="info-col">
          <ProductInfo :product="product" />
        </div>
      </div>

      <!-- Detail Tabs Explorer (Description, Specs, Reviews) -->
      <div class="details-section">
        <ProductTabs :product="product" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 4rem;
}

.breadcrumb-nav {
  background: white;
  padding: 0.875rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: #64748b;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  font-size: 0.8125rem;
}

.sep-pipe {
  color: #e2e8f0;
  font-weight: 300;
}

.sep-slash {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.breadcrumb-items a {
  text-decoration: none;
  color: inherit;
  font-weight: 600;
  transition: color 0.2s;
}

.breadcrumb-items a:hover {
  color: #ef4444;
}

.breadcrumb-items .active {
  color: #ef4444;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-main-card {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 2.75rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
}

.gallery-col {
  width: 450px;
}

.details-section {
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .product-main-card { grid-template-columns: 1fr; gap: 1.5rem; }
  .gallery-col { width: 100%; max-width: 500px; margin: 0 auto; }
}
</style>
