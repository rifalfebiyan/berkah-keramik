<template>
  <div>
    <AppHero />
    <CatalogSection @selectProduct="handleSelectProduct" />
    <CategorySection @category-selected="handleCategorySelect" />
    <FlooringSection @viewAll="handleViewAllFlooring" />
    <BrandSection @brand-selected="handleBrandSelect" />
    <StoreInfoSection />
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

const handleViewAllFlooring = () => {
  router.push(`/flooring`);
};
</script>
