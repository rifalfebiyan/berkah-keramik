<template>
  <div>
    <AppHero />
    <CatalogSection id="promo-section" @selectProduct="handleSelectProduct" />
    <CategorySection id="category-section" @category-selected="handleCategorySelect" />
    <FlooringSection id="flooring-section" @viewAll="handleViewAllRequested" />
    <BrandSection id="brand-section" @brand-selected="handleBrandSelect" />
    <StoreInfoSection id="info-section" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppHero from "~/components/AppHero.vue";
import CategorySection from "~/components/CategorySection.vue";
import FlooringSection from "~/components/FlooringSection.vue";
import CatalogSection from "~/components/CatalogSection.vue";
import BrandSection from "~/components/BrandSection.vue";
import StoreInfoSection from "~/components/StoreInfoSection.vue";

const router = useRouter();

const handleSelectProduct = (product: any) => {
  const id = product.id || encodeURIComponent(product.name || 'product');
  router.push(`/product/${id}`);
};

const handleBrandSelect = (brand: string) => {
  router.push(`/brand/${encodeURIComponent(brand)}`);
};

const handleCategorySelect = (categoryId: number) => {
  router.push(`/category/${categoryId}`);
};

const handleViewAllRequested = (category: any) => {
  if (category?.name) {
    const slug = category.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
    router.push(`/${slug}`);
  }
};
</script>
