import { toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const router = useRouter()

  const $api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      if (token.value) {
        options.headers = options.headers || {}
        ;(options.headers as any).Authorization = `Bearer ${token.value}`
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const isLoginPage = router.currentRoute.value.path === '/login'

        if (!isLoginPage) {
          // Clear token
          token.value = null
          
          // Show Toast
          toast.error('Sesi login kedaluwarsa. Silakan login kembali.', {
            duration: 5000,
          })

          // Redirect to Login
          router.push('/login')
        } else {
          // If already on login page, it's likely a bad credential error
          // We can let the login page handle its own error or show a generic toast
          toast.error('Email atau password salah.', {
            duration: 4000,
          })
        }
      }
    }
  })

  return {
    provide: {
      api: $api
    }
  }
})
