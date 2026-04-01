<script setup lang="ts">
import SALogsTab from '@/components/superadmin/SALogsTab.vue'

definePageMeta({ 
  layout: 'superadmin',
  middleware: 'superadmin'
})
</script>

<template>
  <SALogsTab />
</template>
