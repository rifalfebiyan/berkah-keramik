<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest'
})
</script>

<template>
  <div class="register-page ">
    <AuthRegisterForm />
  </div>
</template>
