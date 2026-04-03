<script setup lang="ts">
const { data: categories, pending, error } = await useApiFetch<
  { id: number; name: string; imageUrl: string | null }[]
>('/categories')

const emit = defineEmits(['category-selected'])

const selectCategory = (id: number) => {
  console.log('klik kategori', id) // cek di console
  emit('category-selected', id)
}
</script>

<template>
<section class="py-12 bg-white">
  <div class="max-w-[1400px] mx-auto px-4">

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-extrabold text-primary">
        Jelajahi Kategori Produk
      </h2>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="text-center py-8 text-gray-500">
      Memuat kategori...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      Gagal memuat data kategori.
    </div>

    <!-- Grid -->
    <div v-else class="flex flex-wrap justify-center gap-8">

      <div
        v-for="cat in categories"
        :key="cat.id"
        class="flex flex-col items-center gap-3 group cursor-pointer"
        @click="selectCategory(cat.id)"
      >

        <div class="w-[170px] h-[170px] bg-white rounded-md flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 group-hover:shadow-lg group-hover:-translate-y-1">
          <img
            :src="cat.imageUrl || '/keramik_kategori.png'"
            :alt="cat.name"
            class="w-full h-full object-cover"
          />
        </div>

        <span class="text-sm font-semibold text-primary text-center">
          {{ cat.name }}
        </span>

      </div>

    </div>

  </div>
</section>
</template>