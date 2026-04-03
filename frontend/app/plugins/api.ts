import { toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const $api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      // Use useCookie dynamically inside the hook
      let token = useCookie('token', { path: '/' }).value
      
      // Fallback: Check localStorage if cookie is failing (client-side only)
      if (!token && import.meta.client) {
        token = localStorage.getItem('token')
      }

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
        // console.debug(`[API Request] Token attached to: ${options.method || 'GET'}`)
      } else {
        console.warn(`[API Request] Warning: No token found for: ${options.method || 'GET'}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const { logout } = useAuth()
        console.warn('Unauthorized request detected. Redirecting to login...')
        logout()
      }
    }
  })

  return {
    provide: {
      api: $api
    }
  }
})
