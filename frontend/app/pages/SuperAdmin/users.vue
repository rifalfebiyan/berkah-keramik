<script setup lang="ts">
import SAUsersTab from '@/components/superadmin/SAUsersTab.vue'

definePageMeta({ 
  layout: 'superadmin',
  middleware: 'superadmin'
})
</script>

<template>
  <SAUsersTab />
</template>
