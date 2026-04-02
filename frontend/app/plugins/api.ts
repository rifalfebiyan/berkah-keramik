import { toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const $api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = options.headers || {}
        ;(options.headers as any).Authorization = `Bearer ${token}`
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const { logout } = useAuth()
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
