<script setup lang="ts">
import { onMounted } from 'vue'

const route = useRoute()

onMounted(async () => {
  const { token, role, name } = route.query

  if (token && role && name) {
    // Save authentication data
    localStorage.setItem('token', token as string)
    localStorage.setItem('userRole', role as string)
    localStorage.setItem('userName', decodeURIComponent(name as string))

    // Redirect based on role
    const userRole = (role as string).toLowerCase()
    
    if (userRole === 'admin') {
      await navigateTo('/admin')
    } else if (userRole === 'superadmin') {
      await navigateTo('/SuperAdmin')
    } else {
      await navigateTo('/')
    }
  } else {
    // If something went wrong, go back to login
    console.error('Missing auth data in callback')
    await navigateTo('/Login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-900">Menyelesaikan Login...</h2>
      <p class="text-gray-500 mt-2">Mohon tunggu sebentar.</p>
    </div>
  </div>
</template>
