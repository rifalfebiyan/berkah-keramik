<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, Play } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
}>()

const activeIndex = ref(0)
const scrollContainer = ref<HTMLElement | null>(null)

const setActive = (index: number) => {
  activeIndex.value = index
}

const scroll = (direction: 'left' | 'right') => {
  if (!scrollContainer.value) return
  const scrollAmount = 100
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="product-gallery">
    <!-- Main Image -->
    <div class="main-image-container">
      <img :src="images[activeIndex]" class="main-image" alt="Product Main View" />
      <div v-if="activeIndex === 0" class="video-icon">
        <Play :size="48" fill="rgba(255,255,255,0.8)" color="none" />
      </div>
    </div>

    <!-- Thumbnails -->
    <div class="thumbnails-wrapper">
      <button class="nav-btn left" @click="scroll('left')">
        <ChevronLeft :size="20" />
      </button>
      
      <div class="thumbnails-container" ref="scrollContainer">
        <div 
          v-for="(img, idx) in images" 
          :key="idx" 
          :class="['thumb-item', { active: activeIndex === idx }]"
          @mouseover="setActive(idx)"
        >
          <img :src="img" :alt="'Thumbnail ' + idx" />
          <div v-if="idx === 0" class="thumb-video-overlay">
            <Play :size="16" fill="white" color="none" />
          </div>
        </div>
      </div>

      <button class="nav-btn right" @click="scroll('right')">
        <ChevronRight :size="20" />
      </button>
    </div>

    <!-- Social Share & Favorite -->
    <div class="gallery-footer">
      <div class="share-links">
        <span>Share:</span>
        <div class="social-icons">
          <div class="s-icon fb"></div>
          <div class="s-icon messenger"></div>
          <div class="s-icon pinterest"></div>
          <div class="s-icon twitter"></div>
        </div>
      </div>
      <div class="favorite">
        <span class="heart">❤️</span>
        <span>Favorit (277,9RB)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 1;
  background: #f8fafc;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.video-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.1);
}

.thumbnails-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 2rem;
}

.thumbnails-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 4px;
}

.thumb-item {
  flex: 0 0 80px;
  height: 80px;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  background: white;
}

.thumb-item.active {
  border-color: #ee2d24;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn {
  position: absolute;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 24px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.nav-btn.left { left: 0; border-radius: 0 4px 4px 0; }
.nav-btn.right { right: 0; border-radius: 4px 0 0 4px; }

.gallery-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #333;
}

.share-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-icons {
  display: flex;
  gap: 0.5rem;
}

.s-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ccc;
}

.s-icon.fb { background: #1877f2; }
.s-icon.messenger { background: #0084ff; }
.s-icon.pinterest { background: #e60023; }
.s-icon.twitter { background: #000; }

.favorite {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.heart { color: #ee2d24; font-size: 1.1rem; }
</style>
