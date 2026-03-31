export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  const role = useCookie('userRole')

  if (!token.value) {
    return navigateTo('/login')
  }

  if (role.value?.toLowerCase() !== 'admin') {
    // If not admin, send back to home
    return navigateTo('/')
  }
})
