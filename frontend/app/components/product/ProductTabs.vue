<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  product: any
}>()

const activeTab = ref('desc')
</script>

<template>
  <div class="product-tabs-section">
    <!-- Tab Nav -->
    <div class="tab-nav">
      <button :class="{ active: activeTab === 'desc' }" @click="activeTab = 'desc'">Deskripsi Produk</button>
      <button :class="{ active: activeTab === 'spec' }" @click="activeTab = 'spec'">Spesifikasi</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'desc'" class="desc-panel">
        <div v-if="product.description" class="white-space-pre-wrap">{{ product.description }}</div>
        <div v-else class="text-gray-400 italic">Tidak ada deskripsi untuk produk ini.</div>
      </div>

      <div v-if="activeTab === 'spec'" class="specs-panel">
        <div class="spec-table">
          <div v-if="product.brand" class="spec-row">
            <div class="spec-key">Merek</div>
            <div class="spec-val">{{ product.brand.name }}</div>
          </div>
          <div v-if="product.category" class="spec-row">
            <div class="spec-key">Kategori</div>
            <div class="spec-val">{{ product.category.name }}</div>
          </div>
          <div v-if="product.subcategory" class="spec-row">
            <div class="spec-key">Subkategori</div>
            <div class="spec-val">{{ product.subcategory.name }}</div>
          </div>
          <div v-if="product.size" class="spec-row">
            <div class="spec-key">Ukuran</div>
            <div class="spec-val">{{ product.size }}</div>
          </div>
          <div v-if="product.color" class="spec-row">
            <div class="spec-key">Warna</div>
            <div class="spec-val">{{ product.color }}</div>
          </div>
          <div class="spec-row">
            <div class="spec-key">Stok</div>
            <div class="spec-val">{{ product.stock }}</div>
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
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05);
}

.tab-nav {
  display: flex;
  background: #fdfdfd;
  border-bottom: 1px solid rgba(0,0,0,0.09);
}

.tab-nav button {
  padding: 1rem 2rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  color: #222;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  font-weight: 500;
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
  min-height: 200px;
}

.desc-panel {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #333;
}

.white-space-pre-wrap {
  white-space: pre-wrap;
}

.spec-table {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.spec-row {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.spec-key {
  width: 12rem;
  color: #757575;
  font-size: 0.875rem;
}

.spec-val {
  color: #222;
  font-size: 0.875rem;
}
</style>
