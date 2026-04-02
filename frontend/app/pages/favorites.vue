<script setup lang="ts">
import { Heart, ChevronLeft, Star, ShoppingCart, Trash2 } from 'lucide-vue-next';

const { favorites, isLoading, fetchFavorites, toggleFavorite } = useFavorites();
const router = useRouter();

onMounted(() => {
  fetchFavorites();
});

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(Math.round(p));

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div class="bg-gray-50/30 min-h-screen py-12">
    <div class="container">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="p-2 hover:bg-white rounded-xl transition border border-transparent hover:border-gray-100 group">
            <ChevronLeft class="text-gray-400 group-hover:text-gray-900" :size="24" />
          </button>
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Favorit Saya</h1>
            <p class="text-gray-500 font-medium text-sm">Produk yang Anda simpan untuk nanti</p>
          </div>
        </div>
        <div v-if="favorites.length > 0" class="px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600">
          {{ favorites.length }} Produk
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && favorites.length === 0" class="py-24 text-center">
        <div class="animate-spin w-10 h-10 border-4 border-gray-200 border-t-primary-blue rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400 font-bold">Memuat koleksi favorit...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-xl shadow-red-500/5 overflow-hidden relative">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-50/50 rounded-full blur-2xl"></div>
          
          <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border-4 border-white shadow-lg animate-bounce">
            ❤️
          </div>
          <h2 class="text-2xl font-black text-gray-900 mb-2 tracking-tight">Koleksi Masih Kosong</h2>
          <p class="text-gray-500 mb-10 font-medium max-w-sm mx-auto">Simpan produk impian Anda agar mudah ditemukan saat Anda siap memilikinya.</p>
          
          <div class="flex justify-center gap-4">
             <button @click="navigateTo('/')" class="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition transform active:scale-95">
                Cari Produk
             </button>
          </div>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="product-grid">
        <div 
          v-for="p in favorites" 
          :key="p.id" 
          class="favorite-card group"
          @click="navigateTo(`/product/${p.id}`)"
        >
          <div class="card-image">
            <img :src="p.imageUrl || '/placeholder.png'" :alt="p.name" />
            <div class="card-badges">
              <span v-if="p.discount" class="discount-badge">-{{ p.discount }}%</span>
            </div>
            
            <!-- Remove Button -->
            <button 
              @click.stop="toggleFavorite(p)" 
              class="remove-btn"
              title="Hapus dari favorit"
            >
              <Trash2 :size="18" />
            </button>
          </div>

          <div class="card-body">
            <div class="brand-row">
              <span class="brand-name">{{ p.brand?.name || 'GENERIC' }}</span>
            </div>
            <h3 class="product-name">{{ p.name }}</h3>
            
            <div class="price-row">
              <div class="prices">
                <span class="current-price">IDR {{ formatPrice(p.price) }}</span>
                <span v-if="p.oldPrice" class="old-price">IDR {{ formatPrice(p.oldPrice) }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="rating">
                <Star :size="14" fill="#ffcc00" color="#ffcc00" />
                <span>{{ p.rating || 5 }}</span>
              </div>
              <button class="add-cart-btn">
                <ShoppingCart :size="16" />
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.favorite-card {
  background: white;
  border-radius: 2.5rem;
  padding: 1rem;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  border-color: #e2e8f0;
}

.card-image {
  aspect-ratio: 1;
  background: #f8fafc;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.25rem;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s;
}

.favorite-card:hover .card-image img {
  transform: scale(1.08);
}

.card-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.discount-badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.remove-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 1rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.2s;
  opacity: 0;
  transform: translateY(10px);
}

.favorite-card:hover .remove-btn {
  opacity: 1;
  transform: translateY(0);
}

.remove-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.card-body {
  padding: 0.5rem;
}

.brand-row {
  margin-bottom: 0.25rem;
}

.brand-name {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  height: 3rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.prices {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 900;
  color: #236d90;
  line-height: 1;
}

.old-price {
  font-size: 0.75rem;
  color: #cbd5e1;
  text-decoration: line-through;
  margin-top: 0.25rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e293b;
}

.add-cart-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  color: #1e293b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}

.favorite-card:hover .add-cart-btn {
  background: #236d90;
  color: white;
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .favorite-card {
    border-radius: 1.5rem;
    padding: 0.75rem;
  }
  .current-price {
    font-size: 1rem;
  }
}
</style>
