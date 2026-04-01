<script setup lang="ts">
definePageMeta({
  middleware: [
    function() {
      return navigateTo('/superadmin/overview')
    }
  ]
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Redirecting to Super Admin Dashboard...</p>
  </div>
</template>
