<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest'
})
</script>

<template>
  <div class="login-page">
    <AuthLoginForm />
  </div>
</template>

