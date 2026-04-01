<script setup lang="ts">
import SAOverviewTab from '@/components/superadmin/SAOverviewTab.vue'

definePageMeta({ 
  layout: 'superadmin',
  middleware: 'superadmin'
})

// Handle navigation from overview stats
const handleNavigate = (tab: string) => {
  navigateTo(`/superadmin/${tab}`)
}
</script>

<template>
  <SAOverviewTab @navigate="handleNavigate" />
</template>
