<script setup lang="ts">
definePageMeta({
  middleware: [
    function() {
      return navigateTo('/admin/dashboard')
    }
  ]
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Redirecting to Dashboard...</p>
  </div>
</template>