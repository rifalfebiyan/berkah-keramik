export default defineNuxtPlugin(() => {
  const token = useCookie('token')

  return {
    provide: {
      auth: {
        token
      }
    }
  }
})