<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  imageUrl: string | null
  images: string[]
}>()

const allImages = computed(() => {
  const list = []
  if (props.imageUrl) list.push(props.imageUrl)
  if (props.images && props.images.length > 0) {
    list.push(...props.images)
  }
  return list
})

const activeIndex = ref(0)
const selectImage = (idx: number) => {
  activeIndex.value = idx
}
</script>

<template>
  <div class="product-gallery">
    <div class="main-image-container">
      <img v-if="allImages[activeIndex]" :src="allImages[activeIndex]" class="main-image" alt="Product Main View" />
      <div v-else class="flex flex-col items-center text-gray-300">
        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs font-bold uppercase tracking-wider">No Image</span>
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="allImages.length > 1" class="thumbnails-container">
      <div 
        v-for="(img, idx) in allImages" 
        :key="idx" 
        :class="['thumb-item', { active: activeIndex === idx }]"
        @click="selectImage(idx)"
      >
        <img :src="img" :alt="'Thumbnail ' + idx" />
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
  background: white;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnails-container {
  display: flex;
  gap: 0.5rem;
}

.thumb-item {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  cursor: pointer;
  padding: 2px;
}

.thumb-item.active {
  border-color: #0055aa;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
