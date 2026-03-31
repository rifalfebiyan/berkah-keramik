<script setup lang="ts">
import ProductGallery from './product/ProductGallery.vue'
import ProductInfo from './product/ProductInfo.vue'
import ProductTabs from './product/ProductTabs.vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  productPreview: any // In real app, this would be a specific product
}>()

const emit = defineEmits(['back'])

// Mock detailed product data
const productDetail = {
  name: 'SIGNATURE CERAMIC 40X40 FT EVEREST KW1',
  brand: 'SIGNATURE',
  price: '67.200',
  oldPrice: '78.000',
  discount: '13%',
  rating: 4.7,
  reviews: '498,2RB',
  images: [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517646281694-2226b1445771?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1534237172340-7d25a8a81814?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1506306573024-8917ad692ca5?auto=format&fit=crop&q=80&w=400',
  ],
  variants: [
    { name: 'GREY FLOWER', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=50' },
    { name: 'CREAM SIMPLE', image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=50' },
  ]
}

const recommendedProducts = [
  { name: 'MILAN CERAMIC 40x40 FT Grisel Grey', price: '62.400', image: 'https://images.unsplash.com/photo-1523413184742-0e9803117b43?auto=format&fit=crop&q=80&w=400' },
  { name: 'ROMA GRANITE 30x60 GT635523R', price: '220.500', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
  { name: 'DBS GRANITE 60X120 8021 WOOD', price: '252.720', image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=400' },
  { name: 'GLASS BLOCK MULIA WAVE 95002', price: '28.401', image: 'https://images.unsplash.com/photo-1517646281694-2226b1445771?auto=format&fit=crop&q=80&w=400' },
  { name: 'SIKA CERAM PEREKAT GRANIT', price: '159.000', image: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=400' },
]
</script>

<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <a href="#" @click.prevent="emit('back')">Beranda</a>
        <ChevronRight :size="14" />
        <a href="#">Perlengkapan Rumah</a>
        <ChevronRight :size="14" />
        <a href="#">Bahan Bangunan</a>
        <ChevronRight :size="14" />
        <span>{{ productDetail.name }}</span>
      </nav>

      <!-- Main Content Grid -->
      <div class="main-content-grid">
        <div class="gallery-col">
          <ProductGallery :images="productDetail.images" />
        </div>
        <div class="info-col">
          <ProductInfo :product="productDetail" />
        </div>
      </div>

      <!-- Detail Tabs -->
      <div class="details-section">
        <ProductTabs />
      </div>

      <!-- Recommendations -->
      <div class="recommendations-section">
        <h3 class="section-title">PRODUK LAIN DARI TOKO INI</h3>
        <div class="recommendations-grid">
           <div v-for="p in recommendedProducts" :key="p.name" class="p-card">
              <div class="p-img">
                <img :src="p.image" :alt="p.name" />
              </div>
              <div class="p-content">
                <h4 class="p-name">{{ p.name }}</h4>
                <div class="p-price">Rp{{ p.price }}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-detail-page {
  background-color: #f5f5f5;
  padding: 1.5rem 0 4rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 1.25rem;
}

.breadcrumbs a { color: #0088ff; text-decoration: none; }
.breadcrumbs span { color: #222; }

.main-content-grid {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 2rem;
  background: white;
  padding: 1.25rem;
  border-radius: 4px;
}

.details-section {
  margin-top: 2rem;
}

.recommendations-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1rem;
  color: #757575;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.p-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  cursor: pointer;
}

.p-card:hover {
  box-shadow: 0 1px 20px 0 rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

.p-img { aspect-ratio: 1; background: #f8fafc; }
.p-img img { width: 100%; height: 100%; object-fit: cover; }

.p-content { padding: 0.75rem; }
.p-name {
  font-size: 0.8rem;
  font-weight: 400;
  height: 2.4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0.5rem;
  color: #222;
}

.p-price {
  color: var(--primary-red);
  font-size: 1rem;
}

@media (max-width: 1024px) {
  .main-content-grid { grid-template-columns: 1fr; }
  .gallery-col { max-width: 500px; margin: 0 auto; }
}
</style>
