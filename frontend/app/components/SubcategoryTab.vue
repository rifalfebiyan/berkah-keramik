<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
import { ArrowRight, Image as ImageIcon } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps<{
  categoryId?: number
}>()

interface SubCategory {
  id: number
  name: string
  imageUrl: string | null
}

const subcategories = ref<SubCategory[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchSubcategories = async () => {
  isLoading.value = true
  error.value = null
  try {
    const url = props.categoryId 
      ? `${apiUrl}/subcategories?categoryId=${props.categoryId}`
      : `${apiUrl}/subcategories`
      
    const data = await $fetch<SubCategory[]>(url)
    subcategories.value = data
  } catch (err) {
    console.error('Failed to fetch subcategories:', err)
    error.value = 'Gagal memuat sub kategori.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSubcategories()
})
</script>

<template>
<div class="space-y-6">
  <!-- Loading -->
  <div v-if="isLoading" class="text-center py-12 text-gray-400">
    Memuat data...
  </div>

  <!-- Error -->
  <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl flex justify-between">
    <span>{{ error }}</span>
    <button @click="fetchSubcategories" class="underline">Coba Lagi</button>
  </div>

  <!-- Card Grid -->
  <div v-if="!isLoading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <Card
      v-for="sub in subcategories"
      :key="sub.id"
      class="group overflow-hidden rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      @click="navigateTo('/subcategory/' + sub.id)"
    >
      <!-- Image -->
      <div class="relative h-64 overflow-hidden bg-gray-50">
        <img
          v-if="sub.imageUrl"
          :src="sub.imageUrl"
          class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div v-else class="w-full h-full flex items-center justify-center p-8 text-gray-300">
          <ImageIcon :size="48" />
        </div>
        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm">
          Terbaru
        </div>
      </div>

      <!-- Content -->
      <CardContent class="p-6 text-center">
        <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition truncate">
          {{ sub.name }}
        </h3>
        <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold italic">Lihat Selengkapnya</p>
        <div class="flex items-center justify-center gap-2 text-blue-600 font-bold mt-4 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
          <span>Kunjungi</span>
          <ArrowRight class="w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Empty -->
  <div v-if="!isLoading && subcategories.length === 0" class="text-center text-gray-400 py-12">
    Belum ada sub kategori.
  </div>
</div>
</template>