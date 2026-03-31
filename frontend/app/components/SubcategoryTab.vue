<script setup lang="ts">
import { ref, onMounted } from 'vue'
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl
import { ArrowRight } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'

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
    const data = await $fetch<SubCategory[]>(
      `${apiUrl}/subcategories`
    )
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
  <div v-if="!isLoading" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <Card
      v-for="sub in subcategories"
      :key="sub.id"
      class="group overflow-hidden rounded-2xl shadow hover:shadow-xl transition cursor-pointer"
      @click="navigateTo('/subcategory/' + sub.id)"
    >
      <!-- Image -->
      <div class="relative h-56 overflow-hidden">
        <img
          v-if="sub.imageUrl"
          :src="sub.imageUrl"
          class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div class="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          NEW
        </div>
      </div>

      <!-- Content -->
      <CardContent class="p-5">
        <h3 class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition">
          {{ sub.name }}
        </h3>
        <p class="text-xs text-gray-500 uppercase tracking-wide">Sub Kategori</p>
        <div class="flex items-center gap-2 text-red-600 font-semibold mt-3 group-hover:gap-3 transition">
          <span>Lihat Produk</span>
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