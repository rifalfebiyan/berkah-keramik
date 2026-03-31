<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

const activeTab = ref('spec')

const specs = [
  { key: 'SKU', val: 'MULIA0204830002' },
  { key: 'Tipe Produk', val: 'KERAMIK' },
  { key: 'Ukuran', val: '40X40CM' },
  { key: 'Warna', val: 'Krem' },
  { key: 'Merek', val: 'Mulia' },
  { key: 'Material', val: 'KERAMIK' },
]

const reviews = [
  { user: 'erizawulandari', rating: 5, date: '2023-10-09 20:51', text: 'Barang udah datang maaf baru bisa kasih nilai tapi barang nya bagus banget kak pengiriman nya juga cepat dan kurir nya juga ramah terimakasih kakak', variant: '4 SUSUN PUTIH' },
  { user: 'lm.ros12', rating: 5, date: '2023-08-25 15:34', text: 'Kualitas oke banget, warna sesuai foto. Packing aman rapi.', variant: '4 SUSUN PUTIH' },
]
</script>

<template>
  <div class="product-tabs-section">
    <!-- Tab Nav -->
    <div class="tab-nav">
      <button :class="{ active: activeTab === 'spec' }" @click="activeTab = 'spec'">SPECIFICATIONS</button>
      <button :class="{ active: activeTab === 'desc' }" @click="activeTab = 'desc'">Deskripsi Produk</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'spec'" class="specs-panel">
        <h3>PRODUCT SPESIFIKASI</h3>
        <div class="spec-table">
          <div v-for="s in specs" :key="s.key" class="spec-row">
            <div class="spec-key">{{ s.key }}</div>
            <div class="spec-val">{{ s.val }}</div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'desc'" class="desc-panel">
        <p>Square rak dapur rak toilet rak susun serbaguna rak dorong rak salon rak troli 4 tingkat dengan roda.</p>
        <ul>
          <li>Ada 4 roda</li>
          <li>Size 30x18x79 Cm (Diukur setelah semua komponen terpasang)</li>
        </ul>
      </div>
    </div>

    <!-- Reviews Section (Always show or use another tab) -->
    <div class="reviews-section">
      <h3>Penilaian Produk</h3>
      <div class="rating-overview">
        <div class="overall-score">
          <span class="big-score">4.7</span>
          <span class="out-of">dari 5</span>
          <div class="stars">
            <Star v-for="i in 5" :key="i" :size="18" :fill="i <= 4 ? '#ee4d2d' : 'none'" :color="i <= 4 ? '#ee4d2d' : '#ccc'" />
          </div>
        </div>
        <div class="filter-btns">
          <button class="active">Semua</button>
          <button>5 Bintang (406,7RB)</button>
          <button>4 Bintang (67,5RB)</button>
          <button>Dengan Komentar (98RB)</button>
          <button>Dengan Media (75,6RB)</button>
        </div>
      </div>

      <div class="reviews-list">
        <div v-for="(rev, idx) in reviews" :key="idx" class="review-item">
          <div class="user-avatar"></div>
          <div class="review-body">
            <div class="user-name">{{ rev.user }}</div>
            <div class="item-stars">
              <Star v-for="i in 5" :key="i" :size="12" :fill="i <= rev.rating ? '#ee4d2d' : 'none'" :color="i <= rev.rating ? '#ee4d2d' : '#ccc'" />
            </div>
            <div class="meta-info">{{ rev.date }} | Variasi: {{ rev.variant }}</div>
            <div class="review-text">{{ rev.text }}</div>
            <div class="review-media" v-if="idx === 0">
               <div class="media-box" v-for="i in 5" :key="i"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-tabs-section {
  background: white;
  border-radius: 4px;
  padding: 0;
  margin-top: 1rem;
}

.tab-nav {
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid rgba(0,0,0,0.09);
}

.tab-nav button {
  padding: 1.25rem 2rem;
  border: none;
  background: none;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  position: relative;
}

.tab-nav button.active {
  color: #ee4d2d;
}

.tab-nav button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #ee4d2d;
}

.tab-content {
  padding: 1.5rem;
}

.specs-panel h3, .reviews-section h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  background: #fdfdfd;
  padding: 0.75rem;
  color: #222;
}

.spec-table {
  display: flex;
  flex-direction: column;
}

.spec-row {
  display: flex;
  padding: 0.75rem;
}

.spec-key {
  width: 15rem;
  color: rgba(0,0,0,0.4);
}

.spec-val {
  color: #222;
}

.desc-panel { font-size: 0.875rem; line-height: 1.6; color: #333; }
.desc-panel ul { padding-left: 1.25rem; margin-top: 0.5rem; }

.reviews-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.rating-overview {
  background: #fffbf8;
  border: 1px solid #f9ede5;
  padding: 2rem;
  border-radius: 2px;
  display: flex;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.big-score { font-size: 1.875rem; color: #ee4d2d; font-weight: 500; }
.out-of { font-size: 1.125rem; color: #ee4d2d; }
.stars { display: flex; gap: 2px; margin-top: 0.5rem; }

.filter-btns { display: flex; flex-wrap: wrap; gap: 0.5rem; flex: 1; }
.filter-btns button {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(0,0,0,0.09);
  background: white;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.875rem;
}

.filter-btns button.active {
  border-color: #ee4d2d;
  color: #ee4d2d;
}

.reviews-list {
  display: flex;
  flex-direction: column;
}

.review-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.09);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  flex-shrink: 0;
}

.user-name { font-size: 0.75rem; color: #222; margin-bottom: 0.25rem; }
.item-stars { display: flex; gap: 1px; margin-bottom: 0.5rem; }
.meta-info { font-size: 0.625rem; color: rgba(0,0,0,0.54); margin-bottom: 0.75rem; }
.review-text { font-size: 0.875rem; line-height: 1.4; color: #333; }

.review-media {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.media-box {
  width: 72px;
  height: 72px;
  background: #f0f0f0;
  border-radius: 2px;
}
</style>
