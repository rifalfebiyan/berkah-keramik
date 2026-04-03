<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryProductListingView from '~/components/CategoryProductListingView.vue'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug)

const category = ref<any>(null)
const isLoading = ref(true)

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
}

const findCategory = async () => {
  isLoading.value = true
  try {
    const categories = await $fetch<any[]>(`${config.public.apiUrl}/categories`)
    const match = categories.find(c => slugify(c.name) === slug.value)
    
    if (match) {
      category.value = match
    } else {
      // If no category matches this slug, we can show a 404 or redirect
      // But since Nuxt matches static routes first, if we are here, 
      // and it's not a category, it's truly a 404.
      throw new Error('Category not found')
    }
  } catch (err) {
    console.error('Routing error:', err)
    // Optional: show 404 or redirect home
    // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  findCategory()
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 font-medium">Menyesuaikan halaman...</p>
      </div>
    </div>

    <template v-else-if="category">
      <CategoryProductListingView 
        :categoryId="category.id" 
        :categoryName="category.name"
        @back="goBack"
      />
    </template>

    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <div class="text-9xl font-black text-gray-200 mb-8">404</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
        <p class="text-gray-500 mb-8">Maaf, kategori atau halaman yang Anda cari tidak tersedia di Berkah Keramik.</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
